import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStore } from './token-store';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenStore = inject(TokenStore);
  const router = inject(Router);

  if (tokenStore.isAuthenticated()) return true;

  return router.createUrlTree(['/login']);
};
