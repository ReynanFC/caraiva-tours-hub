import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  BookingDetails,
  CancelBookingRequest,
  BookingStatus,
  BookingSummary,
  CreateBookingRequest,
  UpdateBookingRequest,
} from '../models/booking.model';
import { PagedResult } from '../../../shared/models/paged-result.model';
import { TourApiResponse, TourSummary } from '../models/tour.model';

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
    let params = new HttpParams()
      .set('search', search.trim())
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PagedResult<BookingSummary>>('/api/bookings', { params });
  }

  getBookingsDetails(id: number): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`/api/bookings/${id}`);
  }

  updateBooking(id: number, request: UpdateBookingRequest): Observable<BookingSummary> {
    return this.http.patch<BookingSummary>(`/api/bookings/${id}`, request);
  }

  confirmBooking(id: number): Observable<BookingSummary> {
    return this.http.patch<BookingSummary>(`/api/bookings/${id}/confirm`, {});
  }

  cancelBooking(id: number, request: CancelBookingRequest): Observable<BookingSummary> {
    return this.http.patch<BookingSummary>(`/api/bookings/${id}/cancel`, request);
  }

  getReceipt(id: number): Observable<Blob> {
    return this.http.get(`/api/bookings/${id}/receipt`, { responseType: 'blob' });
  }

  getAvailableTours(): Observable<PagedResult<TourSummary>> {
    return this.loadTours('', 100, true);
  }

  searchTours(search: string): Observable<PagedResult<TourSummary>> {
    return this.loadTours(search, 10, false);
  }

  private loadTours(
    search: string,
    size: number,
    availableOnly: boolean,
  ): Observable<PagedResult<TourSummary>> {
    const params = new HttpParams()
      .set('search', search.trim())
      .set('page', 0)
      .set('size', size)
      .set('sort', 'name,asc');

    return this.http.get<PagedResult<TourApiResponse>>('/api/tours', { params }).pipe(
      map((result) => ({
        ...result,
        content: result.content
          .filter((tour) => !availableOnly || tour.available)
          .map((tour) => ({
            ...tour,
            effectivePrice:
              tour.isPromotional && tour.promoPricePerPerson != null
                ? tour.promoPricePerPerson
                : tour.basePricePerPerson,
          })),
      })),
    );
  }
}
