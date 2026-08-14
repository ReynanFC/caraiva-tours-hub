import { SessionStore } from './../../../core/auth/session/session-store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from '../../../shared/models/paged-result.model';
import { UserSummary } from '../../../shared/models/user.model';
import { CreateUserRequest } from '../models/user-admin.model';

@Service()
export class UsersService {
  private readonly sessionStore = inject(SessionStore);
  private readonly http = inject(HttpClient);
  private readonly BASE_ENDPOINT = '/api/users';

  getUsers(search = '', page = 0, size = 9): Observable<PagedResult<UserSummary>> {
    this.sessionStore.hasPermissionAdmin();

    const params = new HttpParams()
      .set('search', search.trim())
      .set('page', page)
      .set('size', size)
      .set('sort', 'userName,asc');

    return this.http.get<PagedResult<UserSummary>>(this.BASE_ENDPOINT, { params });
  }

  createUser(request: CreateUserRequest): Observable<UserSummary> {
    this.sessionStore.hasPermissionAdmin();

    return this.http.post<UserSummary>(this.BASE_ENDPOINT, request);
  }

  toggleStatus(id: number, enabled: boolean): Observable<UserSummary> {
    this.sessionStore.hasPermissionAdmin();

    return this.http.patch<UserSummary>(`${this.BASE_ENDPOINT}/${id}/toggle-status`, { enabled });
  }

  getCommissionReport(id: number, month: number, year: number): Observable<Blob> {
    this.sessionStore.hasPermissionEmployee();

    return this.http.get(`${this.BASE_ENDPOINT}/finance/${id}`, {
      params: new HttpParams().set('month', month).set('year', year),
      responseType: 'blob',
    });
  }
}
