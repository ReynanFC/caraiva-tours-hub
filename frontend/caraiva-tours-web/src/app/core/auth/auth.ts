import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
}

@Service()
export class Auth {
  private readonly http = inject(HttpClient);

  signIn(credentials: SignInCredentials): Observable<SignInResponse> {
    return this.http.post<SignInResponse>('/auth/signin', credentials, {
      withCredentials: true,
    });
  }
}
