import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import {
  isPaymentSummary,
  PAYMENT_STATUS_LABELS,
  PaymentBookingStatus,
  PaymentRow,
  PaymentView,
} from '../../models/payment.model';

@Component({
  selector: 'app-payment-list',
  imports: [ButtonModule, CurrencyPipe, DatePipe, PIcon, TableModule],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css',
})
export class PaymentList {
  readonly rows = input.required<PaymentRow[]>();
  readonly view = input.required<PaymentView>();
  readonly loading = input(false);
  readonly page = input(0);
  readonly totalPages = input(0);
  readonly totalElements = input(0);

  readonly detailRequested = output<number>();
  readonly reservationDetailRequested = output<number>();
  readonly previousPage = output<void>();
  readonly nextPage = output<void>();

  protected readonly isPayment = isPaymentSummary;
  protected readonly statusLabels = PAYMENT_STATUS_LABELS;

  protected reference(row: PaymentRow): number {
    return isPaymentSummary(row) ? row.paymentId : row.bookingId;
  }

  protected referenceLabel(): string {
    return this.view() === 'PAYMENTS' ? 'Pagamento' : 'Reserva';
  }

  protected statusClass(status: PaymentBookingStatus): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  protected statusLabel(status: PaymentBookingStatus): string {
    return this.statusLabels[status];
  }
}
