import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenStore } from '../auth/token/token-store';
import { Auth } from '../service/auth';

const AUTH_URL_PREFIX = '/auth/';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStore);
  const authService = inject(Auth);

  const token = tokenStore.getAccessToken();

  const isBackendCall = req.url.startsWith('/api/') || req.url.startsWith('/auth/');
  const isAuthCall = req.url.includes(AUTH_URL_PREFIX);

  const authReq =
    token && isBackendCall && !isAuthCall
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const is401 = error instanceof HttpErrorResponse && error.status === 401;

      if (!is401 || !isBackendCall || isAuthCall) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((newToken) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
        )
      );
    })
  );
};
