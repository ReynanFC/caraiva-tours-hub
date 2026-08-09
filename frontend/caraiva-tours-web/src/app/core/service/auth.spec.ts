import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { TokenStore } from '../auth/token/token-store';
import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;
  let tokenStore: TokenStore;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(Auth);
    tokenStore = TestBed.inject(TokenStore);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should refresh and store the access token', async () => {
    const tokenPromise = firstValueFrom(service.refreshToken());

    const request = httpTesting.expectOne('/auth/refresh');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);
    request.flush({ accessToken: 'new-access-token' });

    await expect(tokenPromise).resolves.toBe('new-access-token');
    expect(tokenStore.getAccessToken()).toBe('new-access-token');
  });

  it('should share one refresh request between concurrent subscribers', async () => {
    const firstToken = firstValueFrom(service.refreshToken());
    const secondToken = firstValueFrom(service.refreshToken());

    const requests = httpTesting.match('/auth/refresh');
    expect(requests).toHaveLength(1);
    requests[0].flush({ accessToken: 'shared-access-token' });

    await expect(Promise.all([firstToken, secondToken])).resolves.toEqual([
      'shared-access-token',
      'shared-access-token',
    ]);
  });

  it('should clear the token and allow another attempt after a refresh failure', async () => {
    tokenStore.setAccessToken('expired-token');
    const failedRefresh = firstValueFrom(service.refreshToken());

    httpTesting
      .expectOne('/auth/refresh')
      .flush({ message: 'Refresh inválido' }, { status: 401, statusText: 'Unauthorized' });

    await expect(failedRefresh).rejects.toMatchObject({ status: 401 });
    expect(tokenStore.getAccessToken()).toBeNull();

    const retry = firstValueFrom(service.refreshToken());
    httpTesting.expectOne('/auth/refresh').flush({ accessToken: 'recovered-token' });

    await expect(retry).resolves.toBe('recovered-token');
  });
});
