import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionStore } from '../../../core/auth/session/session-store';
import { AdminDashboardResponse, DashboardResponse } from '../models/dashboard.model';

export interface DashboardQuery {
  month?: string;
  all?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);

  getDashboard(query: DashboardQuery = {}): Observable<DashboardResponse> {
    this.session.hasPermissionEmployee();

    return this.http.get<DashboardResponse>('/api/dashboard', {
      params: this.buildParams(query),
    });
  }

  getAdminDashboard(query: DashboardQuery = {}): Observable<AdminDashboardResponse> {
    this.session.hasPermissionAdmin();

    return this.http.get<AdminDashboardResponse>('/api/dashboard/finance', {
      params: this.buildParams(query),
    });
  }

  private buildParams(query: DashboardQuery): HttpParams {
    let params = new HttpParams();

    if (query.month) {
      params = params.set('month', query.month);
    }

    if (query.all !== undefined) {
      params = params.set('all', query.all);
    }

    return params;
  }
}
