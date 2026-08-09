import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BookingDetails,
  BookingStatus,
  BookingSummary,
  CreateBookingRequest,
  UpdateBookingRequest,
} from '../models/booking.model';
import { PagedResult } from '../models/paged-result.model';
import { TourSummary } from '../models/tour.model';

@Service()
export class BookingService {
  private readonly http = inject(HttpClient);

  createBooking(request: CreateBookingRequest): Observable<BookingSummary> {
    return this.http.post<BookingSummary>('/api/bookings', request);
  }

  getBookings(
    search = '',
    page = 0,
    size = 10,
    status?: BookingStatus,
  ): Observable<PagedResult<BookingSummary>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sort', 'createdAt,desc');

    const url = status ? `/api/bookings/status/${status}` : '/api/bookings';
    if (!status) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PagedResult<BookingSummary>>(url, { params });
  }

  getBookingsDetails(id: number): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`/api/bookings/${id}`);
  }

  updateBooking(id: number, request: UpdateBookingRequest): Observable<BookingSummary> {
    return this.http.put<BookingSummary>(`/api/bookings/${id}`, request);
  }

  confirmBooking(id: number): Observable<BookingSummary> {
    return this.http.patch<BookingSummary>(`/api/bookings/${id}/confirm`, {});
  }

  getReceipt(id: number): Observable<Blob> {
    return this.http.get(`/api/bookings/${id}/receipt`, { responseType: 'blob' });
  }

  searchTours(search: string): Observable<PagedResult<TourSummary>> {
    const params = new HttpParams()
      .set('search', search.trim())
      .set('page', 0)
      .set('size', 10)
      .set('sort', 'name,asc');

    return this.http.get<PagedResult<TourSummary>>('/api/tours', { params });
  }
}
