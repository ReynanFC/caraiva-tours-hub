export type PaymentBookingStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCEL_REQUEST'
  | 'CANCELLED';

export type PaymentView = 'PAYMENTS' | 'DRAFT' | 'CANCELLED';

export interface PaymentOverview {
  receivedDepositAmount: number;
  awaitingReceiptAmount: number;
  remainingAmount: number;
}

export interface PaymentSummary {
  paymentId: number;
  clientName: string;
  tourName: string;
  scheduledAt: string;
  signalAmount: number;
  totalPrice: number;
  status: PaymentBookingStatus;
}

export interface PaymentReservation {
  bookingId: number;
  paymentId: number | null;
  clientName: string;
  tourName: string;
  scheduledAt: string;
  status: PaymentBookingStatus;
  signalAmount: number;
  totalPrice: number;
}

export type PaymentRow = PaymentSummary | PaymentReservation;

export interface PaymentStatusHistory {
  previousStatus: PaymentBookingStatus | null;
  newStatus: PaymentBookingStatus;
  changeReason: string | null;
  changedAt: string;
  changedByUserName: string;
}

export interface PaymentDetail {
  paymentId: number;
  clientName: string;
  tourName: string;
  totalPrice: number;
  signalAmount: number;
  presentialAmount: number;
  receiptUrl: string | null;
  paidAt: string;
  history: PaymentStatusHistory[];
}

export function isPaymentSummary(row: PaymentRow): row is PaymentSummary {
  return !('bookingId' in row);
}

export const PAYMENT_STATUS_LABELS: Record<PaymentBookingStatus, string> = {
  DRAFT: 'Aguardando comprovante',
  CONFIRMED: 'Sinal confirmado',
  COMPLETED: 'Passeio concluído',
  CANCEL_REQUEST: 'Cancelamento em análise',
  CANCELLED: 'Cancelado',
};
