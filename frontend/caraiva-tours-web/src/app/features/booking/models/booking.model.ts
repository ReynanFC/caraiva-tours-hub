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
  clientName: string;
  tourName: string;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: string;
}
