package com.caraivatours.hub.booking.enums;

public enum BookingStatus {
    DRAFT, // created, waiting for receipt.
    COMPLETED, // receipt approved.
    CONFIRMED, // tour finished.
    CANCELLED, // cancellation under review.
    CANCEL_REQUEST // final cancellation state.
}
