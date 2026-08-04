import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth-guard';

const protectedSections = [
  'dashboard',
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
    loadComponent: () => import('./features/login/page/login').then((m) => m.Login),
  },
  {
    path: 'novo-agendamento',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/booking/pages/booking-create/booking-create').then(
            (m) => m.BookingCreate,
          ),
      },
    ],
  },
  {
    path: 'reservas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/booking/pages/booking-list/booking-list').then(
            (m) => m.BookingList,
          ),
      },
    ],
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
