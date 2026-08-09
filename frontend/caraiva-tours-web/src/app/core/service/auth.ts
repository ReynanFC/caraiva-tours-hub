import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { TokenStore } from '../auth/token/token-store';

@Service()
export class Auth {

  private http = inject(HttpClient);
  private tokenStore = inject(TokenStore);

  private isRefreshing = false;
  private refreshTokenSubject$ = new BehaviorSubject<string | null>(null);

  private readonly REFRESH_URL = '/auth/refresh';

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {

      return this.refreshTokenSubject$.pipe(
        filter((token): token is string => token !== null),
        take(1)
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject$.next(null);

    return this.http.post<{ accessToken: string }>(this.REFRESH_URL, {}, { withCredentials: true }).pipe(
      tap(({ accessToken }) => {
        this.tokenStore.setAccessToken(accessToken);
        this.isRefreshing = false;
        this.refreshTokenSubject$.next(accessToken);
      }),
      switchMap(({ accessToken }) => [accessToken]),
      catchError((refreshError) => {
        this.isRefreshing = false;
        this.tokenStore.clearToken();
        return throwError(() => refreshError);
      })
    );
  }
}
