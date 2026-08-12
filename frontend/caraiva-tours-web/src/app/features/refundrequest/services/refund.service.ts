import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from '../../../shared/models/paged-result.model';
import {
  CreateRefundRequest,
  RefundRequest,
  RefundBookingOption,
  ResolveRefundRequest,
} from '../models/refund-request.model';

@Service()
export class RefundService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/refund-requests';

  getEmployeeRequests(page = 0, size = 10): Observable<PagedResult<RefundRequest>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResult<RefundRequest>>(`${this.endpoint}/mine`, { params });
  }

  getAllRequests(page = 0, size = 10): Observable<PagedResult<RefundRequest>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResult<RefundRequest>>(this.endpoint, { params });
  }

  createRequest(request: CreateRefundRequest): Observable<RefundRequest> {
    return this.http.post<RefundRequest>(this.endpoint, request);
  }

  getBookingOptions(): Observable<RefundBookingOption[]> {
    return this.http.get<RefundBookingOption[]>(`${this.endpoint}/booking-options`);
  }

  resolveRequest(id: number, request: ResolveRefundRequest): Observable<RefundRequest> {
    return this.http.patch<RefundRequest>(`${this.endpoint}/${id}/resolution`, request);
  }
}
