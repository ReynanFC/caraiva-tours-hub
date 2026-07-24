package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.statushistory.StatusHistoryMapper;
import com.caraivatours.hub.payment.dto.PaymentDetailDTO;
import com.caraivatours.hub.payment.dto.PaymentSummaryDTO;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = StatusHistoryMapper.class
)
public interface PaymentMapper {

    @Mapping(target = "paymentId", source = "id")
    @Mapping(target = "clientName", source = "booking.client.name")
    @Mapping(target = "tourName", source = "booking.tour.name")
    @Mapping(target = "scheduledAt", source = "booking.customSchedule")
    @Mapping(target = "signalAmount", source = "expectedAmount")
    @Mapping(
            target = "totalPrice",
            expression = "java(payment.getBooking().calculateTotalPrice())"
    )
    @Mapping(target = "status", source = "booking.currentStatus")
    PaymentSummaryDTO toSummary(Payment payment);

    @Mapping(target = "paymentId", source = "id")
    @Mapping(target = "clientName", source = "booking.client.name")
    @Mapping(target = "tourName", source = "booking.tour.name")
    @Mapping(
            target = "totalPrice",
            expression = "java(payment.getBooking().calculateTotalPrice())"
    )
    @Mapping(target = "signalAmount", source = "expectedAmount")
    @Mapping(
            target = "presentialAmount",
            source = ".",
            qualifiedByName = "calculatePresentialAmount"
    )
    @Mapping(target = "receiptUrl", source = "receiptUrl")
    @Mapping(target = "paidAt", source = "paidAt")
    @Mapping(target = "history", source = "booking.statusHistory")
    PaymentDetailDTO toDetail(Payment payment);

    @Named("calculatePresentialAmount")
    default BigDecimal calculatePresentialAmount(Payment payment) {
        return payment.getBooking()
                .calculateTotalPrice()
                .subtract(payment.getExpectedAmount())
                .setScale(2, RoundingMode.HALF_UP);
    }
}
