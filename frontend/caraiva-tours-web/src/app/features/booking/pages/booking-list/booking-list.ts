import { Component, computed, debounced, inject, resource, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { BookingDetailsDialog } from '../../components/booking-details-dialog/booking-details-dialog';
import { BookingCancelDialog } from '../../components/booking-cancel-dialog/booking-cancel-dialog';
import { BookingEditDialog } from '../../components/booking-edit-dialog/booking-edit-dialog';
import { BookingListFilters } from '../../components/booking-list-filters/booking-list-filters';
import { BookingListTable } from '../../components/booking-list-table/booking-list-table';
import { SessionStore } from '../../../../core/auth/session/session-store';
import { getApiErrorMessage } from '../../../../core/http/api-error';
import {
  BookingStatusFilter,
  BookingSummary,
  UpdateBookingRequest,
} from '../../models/booking.model';
import { BookingService } from '../../services/booking';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.html',
  imports: [BookingListFilters, BookingListTable, ButtonModule, PIcon],
  providers: [DialogService],
  styleUrl: './booking-list.css',
})
export class BookingList {
  private readonly bookingService = inject(BookingService);
  private readonly dialogService = inject(DialogService);
  private readonly notifications = inject(ActionNotificationService);
  private readonly sessionStore = inject(SessionStore);

  protected readonly search = signal('');
  protected readonly selectedStatus = signal<BookingStatusFilter>('ALL');
  protected readonly page = signal(0);
  protected readonly pageSize = 10;

  private readonly debouncedSearch = debounced(this.search, 700);

  protected readonly actionLoadingId = signal<number | null>(null);

  protected readonly isAdmin = this.sessionStore.isAdmin;

  protected readonly currentUserId = computed(() =>
    this.sessionStore.profileResource.hasValue()
      ? (this.sessionStore.profileResource.value()?.id ?? null)
      : null,
  );

  protected readonly bookingsResource = resource({
    params: () => ({
      query: this.debouncedSearch.value(),
      status: this.selectedStatus(),
      page: this.page(),
    }),
    loader: ({ params }) =>
      firstValueFrom(
        this.bookingService.getBookings(
          params.query,
          params.page,
          this.pageSize,
          params.status === 'ALL' ? undefined : params.status,
        ),
      ),
  });

  protected changeStatus(status: BookingStatusFilter): void {
    this.page.set(0);
    this.selectedStatus.set(status);
  }

  protected changeSearch(query: string): void {
    this.page.set(0);
    this.search.set(query);
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(0, page - 1));
  }

  protected nextPage(): void {
    const totalPages = this.bookingsResource.value()?.totalPages ?? 0;
    this.page.update((page) => Math.min(Math.max(0, totalPages - 1), page + 1));
  }

  protected async openBookingDetails(booking: BookingSummary): Promise<void> {
    this.clearActionFeedback();
    this.actionLoadingId.set(booking.id);

    try {
      const details = await firstValueFrom(this.bookingService.getBookingsDetails(booking.id));

      this.dialogService.open(BookingDetailsDialog, {
        header: `Detalhes da reserva #${booking.id}`,
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
      this.actionLoadingId.set(null);
    }
  }

  protected async openEditDialog(booking: BookingSummary): Promise<void> {
    this.clearActionFeedback();
    this.actionLoadingId.set(booking.id);

    try {
      const [details, toursResult] = await Promise.all([
        firstValueFrom(this.bookingService.getBookingsDetails(booking.id)),
        firstValueFrom(this.bookingService.searchTours(booking.tourName)),
      ]);

      this.dialogService.open(BookingEditDialog, {
        header: `Editar reserva #${booking.id}`,
        width: '38rem',
        modal: true,
        dismissableMask: true,
        closeOnEscape: true,
        styleClass: 'booking-edit-dialog',
        breakpoints: { '480px': 'calc(100vw - 2rem)' },
        inputValues: {
          booking,
          details,
          tours: toursResult.content,
          onSave: (payload: UpdateBookingRequest) => this.updateBooking(booking, payload),
        },
      });
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível preparar a edição da reserva.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  protected async openReceipt(booking: BookingSummary): Promise<void> {
    this.clearActionFeedback();
    this.actionLoadingId.set(booking.id);

    try {
      const receipt = await firstValueFrom(this.bookingService.getReceipt(booking.id));
      const url = URL.createObjectURL(receipt);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível gerar o recibo da reserva.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  protected async confirmBooking(booking: BookingSummary): Promise<void> {
    this.clearActionFeedback();
    this.actionLoadingId.set(booking.id);

    try {
      await firstValueFrom(this.bookingService.confirmBooking(booking.id));
      this.notifications.success(`Passeio da reserva #${booking.id} concluído com sucesso.`);
      this.bookingsResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível concluir o passeio.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  protected openCancelDialog(booking: BookingSummary): void {
    if (!this.isAdmin()) return;
    this.clearActionFeedback();
    this.dialogService.open(BookingCancelDialog, {
      header: `Cancelar reserva #${booking.id}`,
      width: '32rem',
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      styleClass: 'booking-cancel-dialog',
      breakpoints: { '480px': 'calc(100vw - 2rem)' },
      inputValues: {
        booking,
        onConfirm: (reason: string) => this.cancelBooking(booking, reason),
      },
    });
  }

  private async cancelBooking(booking: BookingSummary, reason: string): Promise<void> {
    this.actionLoadingId.set(booking.id);
    try {
      await firstValueFrom(this.bookingService.cancelBooking(booking.id, { reason }));
      this.notifications.success(`Reserva #${booking.id} cancelada com sucesso.`);
      this.bookingsResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível cancelar a reserva.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  private async updateBooking(
    booking: BookingSummary,
    payload: UpdateBookingRequest,
  ): Promise<void> {
    this.actionLoadingId.set(booking.id);

    try {
      await firstValueFrom(this.bookingService.updateBooking(booking.id, payload));
      this.notifications.success(`Reserva #${booking.id} atualizada com sucesso.`);
      this.bookingsResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível salvar as alterações da reserva.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  private clearActionFeedback(): void {
    this.notifications.clear();
  }
}
