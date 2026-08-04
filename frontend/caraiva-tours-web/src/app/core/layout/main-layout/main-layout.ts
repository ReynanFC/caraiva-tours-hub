import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { catchError, filter, of, startWith } from 'rxjs';
import { TokenStore } from '../../auth/token/token-store';
import { NavigationItem } from '../navigation-item';
import { Layout } from '../service/layout';
import { UserProfile } from '../user-profile';
import { LayoutHeader } from './components/layout-header/layout-header';
import { LayoutSidebar } from './components/layout-sidebar/layout-sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [SidebarModule, RouterOutlet, LayoutHeader, LayoutSidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private readonly layoutService = inject(Layout);
  private readonly router = inject(Router);
  private readonly tokenStore = inject(TokenStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly userProfile = signal<UserProfile | null>(null);
  protected readonly isMobile = signal(false);
  protected readonly sidebarOpen = signal(true);
  protected readonly pageTitle = signal('Dashboard');
  protected readonly pageDescription = signal('Visão geral da operação da Porto Caraíva.');

  protected readonly navigationItems: readonly NavigationItem[] = [
    {
      label: 'Dashboard',
      description: 'Visão geral da operação da Porto Caraíva.',
      icon: 'home',
      route: '/dashboard',
    },
    {
      label: 'Novo agendamento',
      description: 'Cadastre uma nova reserva de passeio.',
      icon: 'calendar-plus',
      route: '/novo-agendamento',
    },
    {
      label: 'Reservas',
      description: 'Acompanhe e organize todas as reservas.',
      icon: 'calendar',
      route: '/reservas',
    },
    {
      label: 'Passeios',
      description: 'Gerencie passeios, horários e disponibilidade.',
      icon: 'map',
      route: '/passeios',
    },
    {
      label: 'Pagamentos',
      description: 'Consulte sinais, saldos e movimentações.',
      icon: 'wallet',
      route: '/pagamentos',
    },
    {
      label: 'Usuários',
      description: 'Administre os acessos da equipe.',
      icon: 'users',
      route: '/usuarios',
    },
    {
      label: 'Reembolso',
      description: 'Analise e acompanhe solicitações de reembolso.',
      icon: 'undo',
      route: '/reembolso',
    },
  ];

  private mediaQuery?: MediaQueryList;
  private mediaQueryListener?: (event: MediaQueryListEvent) => void;

  ngOnInit(): void {
    this.loadUserProfile();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updatePageHeader());

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    this.mediaQuery = window.matchMedia('(max-width: 1023px)');
    this.updateViewport(this.mediaQuery.matches);
    this.mediaQueryListener = (event) => this.updateViewport(event.matches);
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  ngOnDestroy(): void {
    if (this.mediaQueryListener) {
      this.mediaQuery?.removeEventListener('change', this.mediaQueryListener);
    }
  }

  protected signOut(): void {
    this.tokenStore.clearToken();
    void this.router.navigate(['/login']);
  }

  private loadUserProfile(): void {
    this.layoutService
      .getUserProfile()
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((profile) => this.userProfile.set(profile));
  }

  private updateViewport(isMobile: boolean): void {
    this.isMobile.set(isMobile);
    this.sidebarOpen.set(!isMobile);
  }

  private updatePageHeader(): void {
    const currentPath = `/${this.router.url.split('?')[0].split('/').filter(Boolean)[0] ?? 'dashboard'}`;
    const activeItem = this.navigationItems.find((item) => item.route === currentPath);

    this.pageTitle.set(activeItem?.label ?? 'Dashboard');
    this.pageDescription.set(
      activeItem?.description ?? 'Visão geral da operação da Porto Caraíva.',
    );
  }
}
