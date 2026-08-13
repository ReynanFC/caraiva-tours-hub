import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from '../../../shared/models/paged-result.model';
import {
  PaymentDetail,
  PaymentOverview,
  PaymentReservation,
  PaymentRow,
  PaymentSummary,
  PaymentView,
} from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  getOverview(): Observable<PaymentOverview> {
    return this.http.get<PaymentOverview>('/api/payments/overview');
  }

  getRows(
    view: PaymentView,
    search: string,
    page: number,
    size: number,
  ): Observable<PagedResult<PaymentRow>> {
    if (view !== 'PAYMENTS') {
      return this.getReservations(view, search, page, size);
    }

    return this.getPayments(search, page, size);
  }

  getDetail(id: number): Observable<PaymentDetail> {
    return this.http.get<PaymentDetail>(`/api/payments/${id}`);
  }

  private getPayments(
    search: string,
    page: number,
    size: number,
  ): Observable<PagedResult<PaymentSummary>> {
    const normalizedSearch = search.trim();
    let params = new HttpParams().set('page', page).set('size', size).set('sort', 'paidAt,desc');

    if (/^\d+$/.test(normalizedSearch)) {
      params = params.set('idPayment', normalizedSearch);
    } else if (normalizedSearch) {
      params = params.set('nameClient', normalizedSearch);
    }

    return this.http.get<PagedResult<PaymentSummary>>('/api/payments', { params });
  }

  private getReservations(
    status: Exclude<PaymentView, 'PAYMENTS'>,
    search: string,
    page: number,
    size: number,
  ): Observable<PagedResult<PaymentReservation>> {
    const params = new HttpParams()
      .set('status', status)
      .set('search', search.trim())
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');

    return this.http.get<PagedResult<PaymentReservation>>('/api/payments/reservations', { params });
  }
}
