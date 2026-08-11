import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../shared/models/paged-result.model';
import { ToggleTourAvailabilityRequest, Tour, TourRequest } from '../model/tour.model';
import { SessionStore } from '../../../core/auth/session/session-store';

@Service()
export class Tours {
  private readonly BASE_ENDPOINT = '/api/tours';
  private readonly http = inject(HttpClient);
  private readonly sessionStore = inject(SessionStore);

  getTours(search = '', page = 0, size = 10, categoryId?: number): Observable<PagedResult<Tour>> {
    let params = new HttpParams()
      .set('search', search.trim())
      .set('page', page)
      .set('size', size)
      .set('sort', 'name,desc');

    if (categoryId !== undefined) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<PagedResult<Tour>>(this.BASE_ENDPOINT, { params });
  }

  setAvailableTour(id: number, available: boolean): Observable<Tour> {
    this.sessionStore.hasPermissionAdmin();

    const request: ToggleTourAvailabilityRequest = { available };

    return this.http.patch<Tour>(`${this.BASE_ENDPOINT}/${id}`, request);
  }

  updateTour(id: number, request: TourRequest): Observable<Tour> {
    this.sessionStore.hasPermissionAdmin();

    return this.http.put<Tour>(`${this.BASE_ENDPOINT}/${id}`, request);
  }

  createTour(request: TourRequest): Observable<Tour> {
    this.sessionStore.hasPermissionAdmin();

    return this.http.post<Tour>(this.BASE_ENDPOINT, request);
  }

  deleteTour(id: number): Observable<void> {
    this.sessionStore.hasPermissionAdmin();

    return this.http.delete<void>(`${this.BASE_ENDPOINT}/${id}`);
  }
}
