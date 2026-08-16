export interface CreateBookingRequest {
  client: {
    name: string;
    phone: string;
    email: string | null;
  };
  members: Array<{
    name: string;
    isLapChild: boolean;
  }>;
  tourId: number;
  scheduleDate: string;
  manualDiscount: number | null;
  pixPaymentUrl: string | null;
  pickup: {
    cep: string | null;
    locationName: string;
    referencePoint: string;
    appliedPickupFee: number | null;
  };
}

export interface BookingSummary {
  id: number;
  attendantId: number;
  clientName: string;
  tourName: string;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: BookingStatus;
}

export interface BookingDetails {
  members: BookingMember[];
  commissionEarned: number;
  history: BookingStatusHistory[];
  pickup: BookingPickup;
}

export interface UpdateBookingRequest {
  clientName: string | null;
  clientPhone: string | null;
  tourId: number | null;
  scheduleDate: string | null;
  members: BookingMember[] | null;
  manualDiscount: number | null;
  pixPaymentUrl: string | null;
  pickup: BookingPickup;
}

export interface BookingPickup {
  cep: string | null;
  locationName: string;
  referencePoint: string;
  appliedPickupFee: number | null;
}

export interface CancelBookingRequest {
  reason: string;
}

export interface BookingMember {
  name: string;
  isLapChild: boolean;
}

export interface BookingStatusHistory {
  previousStatus: BookingStatus | null;
  newStatus: BookingStatus;
  changeReason: string | null;
  changedAt: string;
  changedByUserName: string;
}

export type BookingStatus = 'DRAFT' | 'CONFIRMED' | 'COMPLETED' | 'CANCEL_REQUEST' | 'CANCELLED';

export type BookingStatusFilter = BookingStatus | 'ALL';
