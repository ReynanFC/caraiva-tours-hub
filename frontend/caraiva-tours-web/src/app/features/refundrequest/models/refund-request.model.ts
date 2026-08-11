export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RefundRequest {
  id: number;
  bookingId: number;
  reason: string;
  requestedAt: string;
  refundStatus: RefundStatus;
  adminObservation: string | null;
  resolvedAt: string | null;
  requestedByUserId: number;
  resolvedByUserId: number | null;
}

export interface CreateRefundRequest {
  bookingId: number;
  reason: string;
}

export interface RefundBookingOption {
  id: number;
  clientName: string;
  tourName: string;
  schedule: string;
  status: 'DRAFT' | 'CONFIRMED' | 'COMPLETED';
}

export interface ResolveRefundRequest {
  refundStatus: Extract<RefundStatus, 'APPROVED' | 'REJECTED'>;
  adminObservation?: string;
}
