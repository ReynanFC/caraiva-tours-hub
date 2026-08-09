import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TokenStore } from '../auth/token/token-store';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let tokenStore: TokenStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    tokenStore = TestBed.inject(TokenStore);
  });

  afterEach(() => httpTesting.verify());

  it('should add the bearer token to API requests', () => {
    tokenStore.setAccessToken('access-token');

    http.get('/api/bookings').subscribe();

    const request = httpTesting.expectOne('/api/bookings');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush([]);
  });

  it('should not add the token to auth or external requests', () => {
    tokenStore.setAccessToken('access-token');

    http.post('/auth/signin', {}).subscribe();
    http.get('https://example.com/public').subscribe();

    const authRequest = httpTesting.expectOne('/auth/signin');
    const externalRequest = httpTesting.expectOne('https://example.com/public');

    expect(authRequest.request.headers.has('Authorization')).toBe(false);
    expect(externalRequest.request.headers.has('Authorization')).toBe(false);

    authRequest.flush({});
    externalRequest.flush({});
  });

  it('should refresh after a 401 and retry with the new token', () => {
    tokenStore.setAccessToken('expired-token');
    const response = vi.fn();

    http.get('/api/bookings').subscribe(response);

    httpTesting
      .expectOne('/api/bookings')
      .flush({ message: 'Token expirado' }, { status: 401, statusText: 'Unauthorized' });

    const refreshRequest = httpTesting.expectOne('/auth/refresh');
    expect(refreshRequest.request.withCredentials).toBe(true);
    expect(refreshRequest.request.headers.has('Authorization')).toBe(false);
    refreshRequest.flush({ accessToken: 'renewed-token' });

    const retriedRequest = httpTesting.expectOne('/api/bookings');
    expect(retriedRequest.request.headers.get('Authorization')).toBe('Bearer renewed-token');
    retriedRequest.flush([{ id: 1 }]);

    expect(response).toHaveBeenCalledWith([{ id: 1 }]);
    expect(tokenStore.getAccessToken()).toBe('renewed-token');
  });

  it('should use only one refresh for concurrent 401 responses', () => {
    tokenStore.setAccessToken('expired-token');
    const firstResponse = vi.fn();
    const secondResponse = vi.fn();

    http.get('/api/bookings/1').subscribe(firstResponse);
    http.get('/api/bookings/2').subscribe(secondResponse);

    httpTesting
      .expectOne('/api/bookings/1')
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    httpTesting
      .expectOne('/api/bookings/2')
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    const refreshRequests = httpTesting.match('/auth/refresh');
    expect(refreshRequests).toHaveLength(1);
    refreshRequests[0].flush({ accessToken: 'shared-token' });

    const firstRetry = httpTesting.expectOne('/api/bookings/1');
    const secondRetry = httpTesting.expectOne('/api/bookings/2');
    expect(firstRetry.request.headers.get('Authorization')).toBe('Bearer shared-token');
    expect(secondRetry.request.headers.get('Authorization')).toBe('Bearer shared-token');

    firstRetry.flush({ id: 1 });
    secondRetry.flush({ id: 2 });

    expect(firstResponse).toHaveBeenCalledWith({ id: 1 });
    expect(secondResponse).toHaveBeenCalledWith({ id: 2 });
  });

  it('should not refresh non-401 responses', () => {
    tokenStore.setAccessToken('access-token');
    const errorHandler = vi.fn();

    http.get('/api/bookings').subscribe({ error: errorHandler });
    httpTesting
      .expectOne('/api/bookings')
      .flush({ message: 'Falha' }, { status: 500, statusText: 'Server Error' });

    httpTesting.expectNone('/auth/refresh');
    expect(errorHandler).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
  });

  it('should clear the token when refresh fails', () => {
    tokenStore.setAccessToken('expired-token');
    const errorHandler = vi.fn();

    http.get('/api/bookings').subscribe({ error: errorHandler });
    httpTesting.expectOne('/api/bookings').flush(null, { status: 401, statusText: 'Unauthorized' });
    httpTesting.expectOne('/auth/refresh').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(tokenStore.getAccessToken()).toBeNull();
    expect(errorHandler).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    httpTesting.expectNone('/api/bookings');
  });
});
