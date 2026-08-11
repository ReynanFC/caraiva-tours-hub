import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ChangePasswordRequest,
  UpdateUserRequest,
  UserDetails,
  UserSummary,
} from '../models/user.model';

@Service()
export class UserProfileService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/users';

  getMyProfile(): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.endpoint}/me/profile`);
  }

  getProfile(id: number): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.endpoint}/${id}/profile`);
  }

  updateProfile(id: number, request: UpdateUserRequest): Observable<UserSummary> {
    return this.http.put<UserSummary>(`${this.endpoint}/${id}`, request);
  }

  changePassword(id: number, request: ChangePasswordRequest): Observable<UserSummary> {
    return this.http.put<UserSummary>(`${this.endpoint}/${id}/password`, request);
  }
}
