import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenStore } from "./token-store";
import { catchError, firstValueFrom, of } from "rxjs";


export function initSession() : () => Promise<void> {
  const http = inject(HttpClient);
  const tokenStore = inject(TokenStore);

   return () => {
    return firstValueFrom(
      http.post<{ accessToken: string }>('/auth/refresh', {}, { withCredentials: true }).pipe(
        catchError(() => {
          return of(null);
        })
      )
    ).then((result) => {
      if (result) {
        tokenStore.setAccessToken(result.accessToken);
      }
    });
  };
}
