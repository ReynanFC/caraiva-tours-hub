import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SessionStore } from '../../../core/auth/session/session-store';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let http: HttpTestingController;
  const hasPermissionEmployee = vi.fn();
  const hasPermissionAdmin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SessionStore,
          useValue: { hasPermissionEmployee, hasPermissionAdmin },
        },
      ],
    });
    service = TestBed.inject(DashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the authenticated user dashboard from the dedicated endpoint', () => {
    service.getDashboard().subscribe();

    expect(hasPermissionEmployee).toHaveBeenCalledOnce();
    const request = http.expectOne('/api/dashboard');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush({});
  });

  it('loads the admin financial dashboard only through its endpoint', () => {
    service.getAdminDashboard({ month: '2026-08', all: false }).subscribe();

    expect(hasPermissionAdmin).toHaveBeenCalledOnce();
    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/dashboard/finance' &&
        candidate.params.get('month') === '2026-08' &&
        candidate.params.get('all') === 'false',
    );
    expect(request.request.method).toBe('GET');
    request.flush({});
  });
});
