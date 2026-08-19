import { Component, debounced, inject, resource, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { SessionStore } from '../../../../core/auth/session/session-store';
import { getApiErrorMessage } from '../../../../core/http/api-error';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import { PagedResult } from '../../../../shared/models/paged-result.model';
import { PaymentDetailsDialog } from '../../../../shared/components/payment-details-dialog/payment-details-dialog';
import { BookingDetailsDialog } from '../../../booking/components/booking-details-dialog/booking-details-dialog';
import { BookingSummary } from '../../../booking/models/booking.model';
import { BookingService } from '../../../booking/services/booking';
import { PaymentFilters } from '../../components/payment-filters/payment-filters';
import { PaymentList } from '../../components/payment-list/payment-list';
import { PaymentOverview } from '../../components/payment-overview/payment-overview';
import { PaymentRow, PaymentView } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';

const EMPTY_PAGE: PagedResult<PaymentRow> = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
};

@Component({
  selector: 'app-payment-page',
  imports: [ButtonModule, PaymentFilters, PaymentList, PaymentOverview, PIcon],
  providers: [DialogService],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css',
})
export class PaymentPage {
  private readonly payments = inject(PaymentService);
  private readonly bookings = inject(BookingService);
  private readonly dialogs = inject(DialogService);
  private readonly notifications = inject(ActionNotificationService);
  private readonly session = inject(SessionStore);

  protected readonly isAdmin = this.session.isAdmin;
  protected readonly profileLoading = this.session.isLoading;
  protected readonly view = signal<PaymentView>('PAYMENTS');
  protected readonly search = signal('');
  protected readonly page = signal(0);
  protected readonly pageSize = 10;
  protected readonly detailLoadingId = signal<number | null>(null);

  private readonly debouncedSearch = debounced(this.search, 500);

  protected readonly overviewResource = resource({
    params: () => ({ admin: this.isAdmin() }),
    loader: ({ params }) =>
      params.admin ? firstValueFrom(this.payments.getOverview()) : Promise.resolve(null),
  });

  protected readonly rowsResource = resource({
    params: () => ({
      admin: this.isAdmin(),
      view: this.view(),
      search: this.debouncedSearch.value(),
      page: this.page(),
    }),
    loader: ({ params }) =>
      params.admin
        ? firstValueFrom(
            this.payments.getRows(params.view, params.search, params.page, this.pageSize),
          )
        : Promise.resolve(EMPTY_PAGE),
  });

  protected changeView(view: PaymentView): void {
    this.page.set(0);
    this.view.set(view);
  }

  protected changeSearch(search: string): void {
    this.page.set(0);
    this.search.set(search);
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(0, page - 1));
  }

  protected nextPage(): void {
    const lastPage = Math.max(0, (this.rowsResource.value()?.totalPages ?? 1) - 1);
    this.page.update((page) => Math.min(lastPage, page + 1));
  }

  protected reload(): void {
    this.notifications.clear();
    this.overviewResource.reload();
    this.rowsResource.reload();
  }

  protected async openDetails(paymentId: number): Promise<void> {
    this.notifications.clear();
    this.detailLoadingId.set(paymentId);

    try {
      const payment = await firstValueFrom(this.payments.getDetail(paymentId));
      this.dialogs.open(PaymentDetailsDialog, {
        header: `Detalhes do pagamento #${paymentId}`,
        width: '45rem',
        modal: true,
        dismissableMask: true,
        closeOnEscape: true,
        closable: true,
        closeAriaLabel: 'Fechar detalhes do pagamento',
        styleClass: 'payment-details-dialog',
        breakpoints: { '767px': 'calc(100vw - 2rem)' },
        inputValues: { payment },
      });
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível carregar os detalhes do pagamento.'),
      );
    } finally {
      this.detailLoadingId.set(null);
    }
  }

  protected async openReservationDetails(bookingId: number): Promise<void> {
    this.notifications.clear();
    this.detailLoadingId.set(bookingId);

    try {
      const details = await firstValueFrom(this.bookings.getBookingsDetails(bookingId));
      const row = this.rowsResource
        .value()
        ?.content.find((candidate) => 'bookingId' in candidate && candidate.bookingId === bookingId);
      const booking: BookingSummary = details.summary ?? {
        id: bookingId,
        attendantId: 0,
        clientName: row?.clientName ?? '',
        tourName: row?.tourName ?? '',
        date: row?.scheduledAt ?? '',
        groupSize: details.members.length + 1,
        totalPrice: row?.totalPrice ?? 0,
        status: row?.status ?? 'CANCELLED',
      };

      this.dialogs.open(BookingDetailsDialog, {
        header: `Detalhes da reserva #${bookingId}`,
        width: '44rem',
        modal: true,
        dismissableMask: true,
        closeOnEscape: true,
        closable: true,
        closeAriaLabel: 'Fechar detalhes da reserva',
        styleClass: 'booking-details-dialog',
        breakpoints: { '767px': 'calc(100vw - 2rem)' },
        inputValues: { booking, details },
      });
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível carregar os detalhes da reserva.'),
      );
    } finally {
      this.detailLoadingId.set(null);
    }
  }
}
