import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../user-profile';

@Service()
export class Layout {
  private readonly http = inject(HttpClient);

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/users/me/header');
  }
}
