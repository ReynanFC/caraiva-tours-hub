import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { SignInCredentials, SignInResponse } from '../models/sign-in.model';

@Service()
export class LoginService {
  private readonly http = inject(HttpClient);

  signIn(credentials: SignInCredentials): Observable<SignInResponse> {
    return this.http.post<SignInResponse>('/auth/signin', credentials, {
      withCredentials: true,
    });
  }
}
