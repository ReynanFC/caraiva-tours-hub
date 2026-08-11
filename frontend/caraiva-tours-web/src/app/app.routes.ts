import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth-guard';

const emptyProtectedSections = ['dashboard', 'pagamentos', 'reembolso'];

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
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'novo-agendamento',
        loadComponent: () =>
          import('./features/booking/pages/booking-create/booking-create').then(
            (m) => m.BookingCreate,
          ),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./features/booking/pages/booking-list/booking-list').then((m) => m.BookingList),
      },
      {
        path: 'passeios',
        loadComponent: () =>
          import('./features/tours/page/tours-list/tours-list').then((m) => m.ToursList),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/user/pages/users-list/users-list').then((m) => m.UsersList),
      },
      ...emptyProtectedSections.map((path) => ({ path, children: [] })),
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
