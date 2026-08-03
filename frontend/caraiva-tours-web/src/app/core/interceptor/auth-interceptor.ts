import { TokenStore } from './../auth/token-store';
import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

const REFRESH_URL = 'api/auth/refresh';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStore);
  const http = inject(HttpClient);

  const token = tokenStore.getAccessToken();

  const authReq = token && !req.url.includes(REFRESH_URL)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {

      const is401 = error instanceof HttpErrorResponse && error.status === 401;
      const isRefreshCall = req.url.includes(REFRESH_URL);

      if (!is401 || isRefreshCall) {
        return throwError(() => error);
      }

      if (isRefreshing) {

        return refreshedToken$.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap((newToken) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
          )
        );
      }

      isRefreshing = true;
      refreshedToken$.next(null);

      return http.post<{ accessToken: string }>(REFRESH_URL, {}, { withCredentials: true }).pipe(
        switchMap(({ accessToken }) => {
          tokenStore.setAccessToken(accessToken);
          isRefreshing = false;
          refreshedToken$.next(accessToken);

          return next(req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }));
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          tokenStore.clearToken();

          return throwError(() => refreshError);
        })
      );
    })
  );
};
