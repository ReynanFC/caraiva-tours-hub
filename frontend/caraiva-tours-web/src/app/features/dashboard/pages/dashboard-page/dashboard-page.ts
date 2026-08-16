import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  resource,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { debounceTime, firstValueFrom } from 'rxjs';

import { SessionStore } from '../../../../core/auth/session/session-store';
import { getApiErrorMessage } from '../../../../core/http/api-error';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import { UsersService } from '../../../user/services/users';
import { ConfirmationStatus } from '../../components/confirmation-status/confirmation-status';
import { EmployeeSalesRanking } from '../../components/employee-sales-ranking/employee-sales-ranking';
import { LatestBookings } from '../../components/latest-bookings/latest-bookings';
import { MetricCard } from '../../components/metric-card/metric-card';
import { MostRequestedToursChart } from '../../components/most-requested-tours-chart/most-requested-tours-chart';
import { WeeklyRevenueChart } from '../../components/weekly-revenue-chart/weekly-revenue-chart';
import { DashboardMetric } from '../../models/dashboard.model';
import { DashboardEventsService } from '../../services/dashboard-events.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    ButtonModule,
    ConfirmationStatus,
    EmployeeSalesRanking,
    LatestBookings,
    MetricCard,
    MostRequestedToursChart,
    PIcon,
    SkeletonModule,
    WeeklyRevenueChart,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardService);
  private readonly dashboardEvents = inject(DashboardEventsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly session = inject(SessionStore);
  private readonly usersService = inject(UsersService);
  private readonly notifications = inject(ActionNotificationService);
  private userRefreshSequence = 0;
  private adminRefreshSequence = 0;

  protected readonly isAdmin = this.session.isAdmin;
  protected readonly isEmployee = this.session.isEmployee;
  protected readonly currentMonth = this.toMonthValue(new Date());
  protected readonly reportMonth = signal(this.currentMonth);
  protected readonly reportLoading = signal(false);

  protected readonly dashboardResource = resource({
    params: () => (this.isEmployee() ? true : undefined),
    loader: () => firstValueFrom(this.dashboardService.getDashboard()),
  });

  protected readonly adminDashboardResource = resource({
    params: () => (this.isAdmin() ? true : undefined),
    loader: () => firstValueFrom(this.dashboardService.getAdminDashboard()),
  });

  protected readonly personalMetrics = computed<DashboardMetric[]>(() => {
    const dashboard = this.dashboardResource.value();
    const employee = dashboard?.employeeMetrics;

    return [
      {
        label: 'Faturamento mensal',
        value: dashboard?.monthlyRevenue ?? 0,
        description: 'Receita pessoal confirmada no mês',
        icon: 'wallet',
        format: 'currency',
        tone: 'primary',
      },
      {
        label: 'Reservas de hoje',
        value: dashboard?.todayBookings ?? 0,
        description: 'Novos agendamentos registrados hoje',
        icon: 'calendar-plus',
        format: 'number',
        tone: 'info',
      },
      {
        label: 'Comissões pendentes',
        value: dashboard?.pendingCommissions ?? 0,
        description: 'Aguardando confirmação das reservas',
        icon: 'clock',
        format: 'currency',
        tone: 'warning',
      },
      {
        label: 'Comissão mensal',
        value: employee?.monthlyCommissionRevenue ?? 0,
        description: 'Comissão acumulada no mês atual',
        icon: 'dollar',
        format: 'currency',
        tone: 'success',
      },
      {
        label: 'Passeios concluídos',
        value: employee?.completedTours ?? 0,
        description: 'Reservas finalizadas neste mês',
        icon: 'check-circle',
        format: 'number',
        tone: 'success',
      },
      {
        label: 'Reservas em rascunho',
        value: employee?.pendingDraftBookings ?? 0,
        description: 'Aguardando envio do comprovante',
        icon: 'file',
        format: 'number',
        tone: 'neutral',
      },
    ];
  });

  protected readonly adminMetrics = computed<DashboardMetric[]>(() => {
    const dashboard = this.adminDashboardResource.value();

    return [
      {
        label: 'Receita confirmada',
        value: dashboard?.confirmedRevenue ?? 0,
        description: 'Reservas confirmadas e concluídas',
        icon: 'check-circle',
        format: 'currency',
        tone: 'success',
      },
      {
        label: 'Valores a receber',
        value: dashboard?.receivable ?? 0,
        description: 'Reservas ainda aguardando confirmação',
        icon: 'clock',
        format: 'currency',
        tone: 'warning',
      },
      {
        label: 'Pedidos cancelados',
        value: dashboard?.cancelledOrders ?? 0,
        description: 'Cancelamentos registrados no mês',
        icon: 'times-circle',
        format: 'number',
        tone: 'neutral',
      },
      {
        label: 'Receita bruta',
        value: dashboard?.grossRevenue ?? 0,
        description: 'Volume total movimentado no período',
        icon: 'chart-line',
        format: 'currency',
        tone: 'primary',
      },
    ];
  });

  protected readonly refreshing = computed(
    () =>
      this.dashboardResource.isLoading() ||
      (this.isAdmin() && this.adminDashboardResource.isLoading()),
  );

  constructor() {
    this.dashboardEvents
      .connect()
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event.type === 'reconnected') {
          this.refreshSilently();
          return;
        }

        if (event.data.view === 'USER' && this.isEmployee()) {
          void this.refreshUserSilently();
        }
        if (event.data.view === 'FINANCE' && this.isAdmin()) {
          void this.refreshAdminSilently();
        }
      });
  }

  protected reload(): void {
    if (this.isEmployee()) {
      this.dashboardResource.reload();
    }
    if (this.isAdmin()) {
      this.adminDashboardResource.reload();
    }
  }

  private refreshSilently(): void {
    if (this.isEmployee()) {
      void this.refreshUserSilently();
    }
    if (this.isAdmin()) {
      void this.refreshAdminSilently();
    }
  }

  private async refreshUserSilently(): Promise<void> {
    const refreshSequence = ++this.userRefreshSequence;

    try {
      const dashboard = await firstValueFrom(this.dashboardService.getDashboard());
      if (refreshSequence === this.userRefreshSequence) {
        this.dashboardResource.set(dashboard);
      }
    } catch {
      // Mantém os dados atuais; o próximo evento ou refresh manual tentará novamente.
    }
  }

  private async refreshAdminSilently(): Promise<void> {
    const refreshSequence = ++this.adminRefreshSequence;

    try {
      const dashboard = await firstValueFrom(this.dashboardService.getAdminDashboard());
      if (refreshSequence === this.adminRefreshSequence) {
        this.adminDashboardResource.set(dashboard);
      }
    } catch {
      // Mantém os dados atuais; o próximo evento ou refresh manual tentará novamente.
    }
  }

  protected changeReportMonth(event: Event): void {
    this.reportMonth.set((event.target as HTMLInputElement).value);
  }

  protected async openCommissionReport(): Promise<void> {
    if (this.reportLoading()) return;

    const employeeId = this.session.userId();
    const selectedPeriod = this.reportMonth();
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(selectedPeriod) || selectedPeriod > this.currentMonth) {
      this.notifications.error('Selecione um mês válido para gerar o relatório.');
      return;
    }

    if (!employeeId) {
      this.notifications.error('Não foi possível identificar o funcionário autenticado.');
      return;
    }

    const [year, month] = selectedPeriod.split('-').map(Number);

    this.reportLoading.set(true);
    this.notifications.clear();
    const reportWindow = window.open('', '_blank');

    try {
      const report = await firstValueFrom(
        this.usersService.getCommissionReport(employeeId, month, year),
      );
      const url = URL.createObjectURL(report);

      if (reportWindow) {
        reportWindow.opener = null;
        reportWindow.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error: unknown) {
      reportWindow?.close();
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível gerar o relatório de comissões.'),
      );
    } finally {
      this.reportLoading.set(false);
    }
  }

  private toMonthValue(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
}
