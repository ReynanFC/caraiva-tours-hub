import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

export type PaymentDetailsStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCEL_REQUEST'
  | 'CANCELLED';

export interface PaymentDetailsData {
  paymentId: number;
  clientName: string;
  tourName: string;
  totalPrice: number;
  signalAmount: number;
  presentialAmount: number;
  receiptUrl: string | null;
  paidAt: string;
  history: PaymentDetailsHistory[];
}

export interface PaymentDetailsHistory {
  previousStatus: PaymentDetailsStatus | null;
  newStatus: PaymentDetailsStatus;
  changeReason: string | null;
  changedAt: string;
  changedByUserName: string;
}

const STATUS_LABELS: Record<PaymentDetailsStatus, string> = {
  DRAFT: 'Aguardando comprovante',
  CONFIRMED: 'Sinal confirmado',
  COMPLETED: 'Passeio concluído',
  CANCEL_REQUEST: 'Cancelamento em análise',
  CANCELLED: 'Cancelado',
};

@Component({
  selector: 'app-payment-details-dialog',
  imports: [ButtonModule, CurrencyPipe, DatePipe, PIcon, TimelineModule],
  templateUrl: './payment-details-dialog.html',
  styleUrl: './payment-details-dialog.css',
})
export class PaymentDetailsDialog {
  readonly payment = input.required<PaymentDetailsData>();

  protected statusClass(status: PaymentDetailsStatus): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  protected statusLabel(status: PaymentDetailsStatus): string {
    return STATUS_LABELS[status];
  }
}
