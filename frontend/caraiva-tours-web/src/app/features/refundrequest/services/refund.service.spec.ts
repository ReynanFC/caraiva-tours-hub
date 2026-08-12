import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RefundService } from './refund.service';

describe('RefundService', () => {
  let service: RefundService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RefundService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the authenticated employee requests', () => {
    service.getEmployeeRequests(1, 10).subscribe();
    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/refund-requests/mine' &&
        candidate.params.get('page') === '1' &&
        candidate.params.get('size') === '10',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 });
  });

  it('creates a refund request', () => {
    const payload = { bookingId: 42, reason: 'Passeio cancelado' };
    service.createRequest(payload).subscribe();
    const request = http.expectOne('/api/refund-requests');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({});
  });

  it('loads the authenticated employee booking options', () => {
    service.getBookingOptions().subscribe();
    const request = http.expectOne('/api/refund-requests/booking-options');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('loads every request for an administrator', () => {
    service.getAllRequests(0, 10).subscribe();
    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/refund-requests' && candidate.params.get('page') === '0',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
  });

  it('resolves a pending request', () => {
    service.resolveRequest(7, { refundStatus: 'APPROVED' }).subscribe();
    const request = http.expectOne('/api/refund-requests/7/resolution');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ refundStatus: 'APPROVED' });
    request.flush({});
  });
});
