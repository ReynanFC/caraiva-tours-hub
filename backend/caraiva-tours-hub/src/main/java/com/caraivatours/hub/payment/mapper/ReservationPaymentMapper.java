package com.caraivatours.hub.payment.mapper;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.payment.dto.ReservationPaymentDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ReservationPaymentMapper {
    @Mapping(target = "bookingId", source = "id")
    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "clientName", source = "client.name")
    @Mapping(target = "tourName", source = "tour.name")
    @Mapping(target = "scheduledAt", source = "customSchedule")
    @Mapping(target = "status", source = "currentStatus")
    @Mapping(target = "signalAmount", expression = "java(booking.calculateRequiredDeposit())")
    @Mapping(target = "totalPrice", expression = "java(booking.calculateTotalPrice())")
    ReservationPaymentDTO toReservationPayment(Booking booking);
}
