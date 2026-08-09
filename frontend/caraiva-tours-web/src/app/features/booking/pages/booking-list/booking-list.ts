import { Component, computed, debounced, inject, resource, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';

import { BookingDetailsDialog } from '../../components/booking-details-dialog/booking-details-dialog';
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

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.html',
  imports: [BookingListFilters, BookingListTable, ButtonModule, PIcon, ToastModule],
  providers: [DialogService, MessageService],
  styleUrl: './booking-list.css',
})
export class BookingList {
  private readonly bookingService = inject(BookingService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly sessionStore = inject(SessionStore);

  protected readonly search = signal('');
  protected readonly selectedStatus = signal<BookingStatusFilter>('ALL');
  protected readonly page = signal(0);
  protected readonly pageSize = 10;

  private readonly debouncedSearch = debounced(this.search, 700);

  protected readonly actionLoadingId = signal<number | null>(null);

  protected readonly isAdmin = computed(
    () =>
      this.sessionStore.profileResource.hasValue() &&
      this.sessionStore.profileResource.value()?.role === 'ADMIN',
  );

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
      this.showError(
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
      this.showError(
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
      this.showError(await getApiErrorMessage(error, 'Não foi possível gerar o recibo da reserva.'));
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  protected async confirmBooking(booking: BookingSummary): Promise<void> {
    this.clearActionFeedback();
    this.actionLoadingId.set(booking.id);

    try {
      await firstValueFrom(this.bookingService.confirmBooking(booking.id));
      this.showSuccess(`Passeio da reserva #${booking.id} concluído com sucesso.`);
      this.bookingsResource.reload();
    } catch (error: unknown) {
      this.showError(await getApiErrorMessage(error, 'Não foi possível concluir o passeio.'));
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
      this.showSuccess(`Reserva #${booking.id} atualizada com sucesso.`);
      this.bookingsResource.reload();
    } catch (error: unknown) {
      this.showError(
        await getApiErrorMessage(error, 'Não foi possível salvar as alterações da reserva.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  private clearActionFeedback(): void {
    this.messageService.clear('booking-actions');
  }

  private showSuccess(detail: string): void {
    this.messageService.add({
      key: 'booking-actions',
      severity: 'success',
      summary: 'Ação concluída',
      detail,
      life: 2_000,
      closable: false,
    });
  }

  private showError(detail: string): void {
    this.messageService.add({
      key: 'booking-actions',
      severity: 'error',
      summary: 'Ação não realizada',
      detail,
      life: 2_000,
      closable: false,
    });
  }
}
