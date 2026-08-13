import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PaymentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the financial overview', () => {
    service.getOverview().subscribe();

    const request = http.expectOne('/api/payments/overview');
    expect(request.request.method).toBe('GET');
    request.flush({
      receivedDepositAmount: 200,
      awaitingReceiptAmount: 100,
      remainingAmount: 400,
    });
  });

  it('searches a payment by numeric identifier', () => {
    service.getRows('PAYMENTS', ' 42 ', 1, 10).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/payments' &&
        candidate.params.get('idPayment') === '42' &&
        !candidate.params.has('nameClient') &&
        candidate.params.get('page') === '1',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 });
  });

  it('searches payments by client name', () => {
    service.getRows('PAYMENTS', ' Maria ', 0, 10).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/payments' &&
        candidate.params.get('nameClient') === 'Maria' &&
        !candidate.params.has('idPayment'),
    );
    request.flush({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
  });

  it('loads pending reservations through the reservations endpoint', () => {
    service.getRows('DRAFT', 'ana', 0, 10).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/payments/reservations' &&
        candidate.params.get('status') === 'DRAFT' &&
        candidate.params.get('search') === 'ana',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
  });

  it('loads payment details', () => {
    service.getDetail(9).subscribe();

    const request = http.expectOne('/api/payments/9');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });
});
