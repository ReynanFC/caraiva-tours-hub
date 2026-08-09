import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Layout } from './layout';

describe('Layout', () => {
  let service: Layout;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Layout);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should request the current user header data', () => {
    service.getUserProfile().subscribe((profile) => {
      expect(profile).toEqual({ id: 7, name: 'Maria Oliveira', role: 'ADMIN' });
    });

    const request = httpTesting.expectOne('/api/users/me/header');
    expect(request.request.method).toBe('GET');
    request.flush({ id: 7, name: 'Maria Oliveira', role: 'ADMIN' });
  });
});
