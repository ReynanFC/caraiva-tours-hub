import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { BookingSummary, CreateBookingRequest } from '../models/booking.model';
import { PagedResult } from '../models/paged-result.model';
import { TourSummary } from '../models/tour.model';

@Service()
export class BookingService {
  private readonly http = inject(HttpClient);

  createBooking(request: CreateBookingRequest): Observable<BookingSummary> {
    return this.http.post<BookingSummary>('/api/bookings', request);
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
