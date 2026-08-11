import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { SignInCredentials, SignInResponse } from '../models/sign-in.model';

export interface ApiMessageResponse {
  message: string;
}

@Service()
export class LoginService {
  private readonly http = inject(HttpClient);

  signIn(credentials: SignInCredentials): Observable<SignInResponse> {
    return this.http.post<SignInResponse>('/auth/signin', credentials, {
      withCredentials: true,
    });
  }

  requestPasswordReset(email: string): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>('/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>('/auth/reset-password', { token, newPassword });
  }
}
