import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth-guard';

const protectedSections = [
  'dashboard',
  'novo-agendamento',
  'reservas',
  'passeios',
  'pagamentos',
  'usuarios',
  'reembolso',
];

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  ...protectedSections.map((path) => ({
    path,
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
  })),
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
