import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-booking-details-dialog',
  imports: [CurrencyPipe, DatePipe, PIcon, TimelineModule],
  templateUrl: './booking-details-dialog.html',
  styleUrl: './booking-details-dialog.css',
})
export class BookingDetailsDialog {
  readonly booking = input.required<import('../../models/booking.model').BookingSummary>();
  readonly details = input.required<import('../../models/booking.model').BookingDetails>();

  protected readonly statusLabels: Record<
    import('../../models/booking.model').BookingStatus,
    string
  > = {
    DRAFT: 'Aguardando comprovante',
    CONFIRMED: 'Passeio confirmado',
    COMPLETED: 'Passeio concluído',
    CANCELLED: 'Cancelamento em análise',
    CANCEL_REQUEST: 'Cancelamento concluído',
  };

  protected statusClass(status: import('../../models/booking.model').BookingStatus): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  protected statusLabel(status: import('../../models/booking.model').BookingStatus): string {
    return this.statusLabels[status];
  }
}
