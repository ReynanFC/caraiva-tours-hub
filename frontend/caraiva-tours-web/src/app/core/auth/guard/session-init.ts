import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStore } from '../token/token-store';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';

const SESSION_REFRESH_TIMEOUT_MS = 5_000;

export function initSession(): Promise<void> {
  const http = inject(HttpClient);
  const tokenStore = inject(TokenStore);

  return firstValueFrom(
    http.post<{ accessToken: string }>('/auth/refresh', {}, { withCredentials: true }).pipe(
      timeout(SESSION_REFRESH_TIMEOUT_MS),
      catchError(() => of(null)),
    ),
  ).then((result) => {
    if (result) {
      tokenStore.setAccessToken(result.accessToken);
    }
  });
}
