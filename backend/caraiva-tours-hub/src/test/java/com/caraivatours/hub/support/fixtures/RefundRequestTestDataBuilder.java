package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.refundrequest.RefundRequest;
import com.caraivatours.hub.refundrequest.enums.RefundStatus;
import com.caraivatours.hub.user.User;

import java.time.LocalDateTime;

import static com.caraivatours.hub.support.fixtures.BookingTestDataBuilder.aBooking;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;

public final class RefundRequestTestDataBuilder {

    private Long id;
    private String reason = "O cliente não poderá comparecer ao passeio.";
    private String adminObservation;
    private RefundStatus status = RefundStatus.PENDING;
    private LocalDateTime requestedAt = LocalDateTime.of(2026, 1, 11, 8, 30);
    private LocalDateTime resolvedAt;
    private Booking booking = aBooking().build();
    private User requestedByUser = aUser().build();
    private User resolvedByUser;

    private RefundRequestTestDataBuilder() {
    }

    public static RefundRequestTestDataBuilder aRefundRequest() {
        return new RefundRequestTestDataBuilder();
    }

    public RefundRequestTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public RefundRequestTestDataBuilder withReason(String reason) {
        this.reason = reason;
        return this;
    }

    public RefundRequestTestDataBuilder withAdminObservation(String adminObservation) {
        this.adminObservation = adminObservation;
        return this;
    }

    public RefundRequestTestDataBuilder withStatus(RefundStatus status) {
        this.status = status;
        return this;
    }

    public RefundRequestTestDataBuilder withRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
        return this;
    }

    public RefundRequestTestDataBuilder withResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
        return this;
    }

    public RefundRequestTestDataBuilder withBooking(Booking booking) {
        this.booking = booking;
        return this;
    }

    public RefundRequestTestDataBuilder requestedBy(User requestedByUser) {
        this.requestedByUser = requestedByUser;
        return this;
    }

    public RefundRequestTestDataBuilder resolvedBy(User resolvedByUser) {
        this.resolvedByUser = resolvedByUser;
        return this;
    }

    public RefundRequest build() {
        RefundRequest refundRequest = new RefundRequest();
        refundRequest.setId(id);
        refundRequest.setReason(reason);
        refundRequest.setAdminObservation(adminObservation);
        refundRequest.setRefundStatus(status);
        refundRequest.setRequestedAt(requestedAt);
        refundRequest.setResolvedAt(resolvedAt);
        refundRequest.setBooking(booking);
        refundRequest.setRequestedByUser(requestedByUser);
        refundRequest.setResolvedByUser(resolvedByUser);
        return refundRequest;
    }
}
