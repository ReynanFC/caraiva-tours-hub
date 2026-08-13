import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { filter, firstValueFrom, startWith } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SessionStore } from '../../auth/session/session-store';
import { TokenStore } from '../../auth/token/token-store';
import { NavigationItem } from '../models/navigation-item';
import { LayoutHeader } from './components/layout-header/layout-header';
import { LayoutSidebar } from './components/layout-sidebar/layout-sidebar';
import { ActionNotificationService } from '../../../shared/components/action-notification/action-notification.service';
import { UserProfileDialog } from '../../../shared/components/user-profile-dialog/user-profile-dialog';
import { UserProfileService } from '../../../shared/services/user-profile.service';
import { getApiErrorMessage } from '../../http/api-error';

@Component({
  selector: 'app-main-layout',
  imports: [SidebarModule, RouterOutlet, LayoutHeader, LayoutSidebar],
  providers: [DialogService],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private readonly router = inject(Router);
  private readonly sessionStore = inject(SessionStore);
  private readonly tokenStore = inject(TokenStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogs = inject(DialogService);
  private readonly userProfiles = inject(UserProfileService);
  private readonly notifications = inject(ActionNotificationService);

  protected readonly profileResource = this.sessionStore.profileResource;
  protected readonly userProfile = computed(() =>
    this.profileResource.hasValue() ? this.profileResource.value() : null,
  );
  protected readonly isMobile = signal(false);
  protected readonly sidebarOpen = signal(true);
  protected readonly pageTitle = signal('Dashboard');
  protected readonly pageDescription = signal('Visão geral da operação da Porto Caraíva.');

  private readonly allNavigationItems: readonly NavigationItem[] = [
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
      description: 'Gerencie e audite todos os agendamentos.',
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
  protected readonly navigationItems = computed(() =>
    this.allNavigationItems.filter(
      (item) =>
        !['/usuarios', '/pagamentos'].includes(item.route) || this.userProfile()?.role === 'ADMIN',
    ),
  );

  private mediaQuery?: MediaQueryList;
  private mediaQueryListener?: (event: MediaQueryListEvent) => void;

  ngOnInit(): void {
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
    this.sessionStore.clear();
    void this.router.navigate(['/login']);
  }

  protected async openOwnProfile(): Promise<void> {
    try {
      const profile = await firstValueFrom(this.userProfiles.getMyProfile());
      this.dialogs.open(UserProfileDialog, {
        header: 'Meu perfil',
        width: '32rem',
        modal: true,
        dismissableMask: true,
        breakpoints: { '560px': 'calc(100vw - 2rem)' },
        inputValues: {
          profile,
          editable: true,
          profileUpdated: () => this.profileResource.reload(),
        },
      });
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível carregar seu perfil.'),
      );
    }
  }

  private updateViewport(isMobile: boolean): void {
    this.isMobile.set(isMobile);
    this.sidebarOpen.set(!isMobile);
  }

  private updatePageHeader(): void {
    const currentPath = `/${this.router.url.split('?')[0].split('/').filter(Boolean)[0] ?? 'dashboard'}`;
    const activeItem = this.navigationItems().find((item) => item.route === currentPath);

    this.pageTitle.set(activeItem?.label ?? 'Dashboard');
    this.pageDescription.set(
      activeItem?.description ?? 'Visão geral da operação da Porto Caraíva.',
    );
  }
}
