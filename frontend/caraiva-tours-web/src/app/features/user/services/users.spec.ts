import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SessionStore } from '../../../core/auth/session/session-store';
import { UsersService } from './users';

describe('UsersService', () => {
  let service: UsersService;
  let http: HttpTestingController;
  const hasPermissionEmployee = vi.fn();

  beforeEach(() => {
    hasPermissionEmployee.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SessionStore, useValue: { hasPermissionEmployee } },
      ],
    });
    service = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('validates employee access and requests the monthly commission PDF', () => {
    service.getCommissionReport(17, 8, 2026).subscribe();

    expect(hasPermissionEmployee).toHaveBeenCalledOnce();
    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/users/finance/17' &&
        candidate.params.get('month') === '8' &&
        candidate.params.get('year') === '2026',
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob([], { type: 'application/pdf' }));
  });
});
