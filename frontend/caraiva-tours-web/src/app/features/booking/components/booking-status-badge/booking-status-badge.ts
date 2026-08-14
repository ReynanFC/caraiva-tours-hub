import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BookingStatus } from '../../models/booking.model';

interface BookingStatusPresentation {
  label: string;
  className: string;
}

const BOOKING_STATUS_PRESENTATION: Readonly<Record<BookingStatus, BookingStatusPresentation>> = {
  DRAFT: { label: 'Aguardando comprovante', className: 'status-draft' },
  CONFIRMED: { label: 'Confirmada', className: 'status-confirmed' },
  COMPLETED: { label: 'Concluída', className: 'status-completed' },
  CANCEL_REQUEST: { label: 'Cancelamento em análise', className: 'status-cancel-request' },
  CANCELLED: { label: 'Cancelada', className: 'status-cancelled' },
};

@Component({
  selector: 'app-booking-status-badge',
  templateUrl: './booking-status-badge.html',
  styleUrl: './booking-status-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingStatusBadge {
  readonly status = input.required<BookingStatus>();
  readonly presentation = computed(() => BOOKING_STATUS_PRESENTATION[this.status()]);
}
