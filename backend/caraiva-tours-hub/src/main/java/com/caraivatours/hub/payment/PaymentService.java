package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.payment.dto.PaymentDetailDTO;
import com.caraivatours.hub.payment.dto.PaymentSummaryDTO;
import com.caraivatours.hub.payment.dto.PaymentOverviewDTO;
import com.caraivatours.hub.payment.dto.ReservationPaymentDTO;
import com.caraivatours.hub.payment.mapper.PaymentMapper;
import com.caraivatours.hub.payment.mapper.ReservationPaymentMapper;
import com.caraivatours.hub.payment.projection.PaymentOverviewProjection;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final ReservationPaymentMapper reservationPaymentMapper;

    public PaymentOverviewDTO getOverview() {
        log.info("Fetching payment financial overview");
        PaymentOverviewProjection overview = paymentRepository.paymentOverview(
                java.util.List.of(BookingStatus.COMPLETED, BookingStatus.CONFIRMED), BookingStatus.DRAFT, BookingStatus.COMPLETED);
        return new PaymentOverviewDTO(amount(overview.getReceivedDepositAmount()), amount(overview.getAwaitingReceiptAmount()), amount(overview.getRemainingAmount()));
    }

    public Page<ReservationPaymentDTO> searchReservations(BookingStatus status, String search, Pageable pageable) {
        String normalizedSearch = search == null ? "" : search.trim();
        log.info("Searching payment reservations with status={}, search={}", status, normalizedSearch);
        return paymentRepository.findReservationsForPayment(status, normalizedSearch, pageable)
                .map(reservationPaymentMapper::toReservationPayment);
    }

    @Cacheable(value = "payments", key = "'search:' + #idPayment + ':' + #nameClient + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort")
    public Page<PaymentSummaryDTO> findAllByNameClientOrId(Long idPayment, String nameClient, Pageable pageable) {
        log.debug("Searching payments by idPayment={}, nameClient={}, page={}", idPayment, nameClient, pageable);

        Page<Payment> payments = paymentRepository.findAllByFilters(idPayment, nameClient, pageable);
        log.info("Found {} payments matching filters (idPayment={}, nameClient={})",
                payments.getTotalElements(), idPayment, nameClient);

        return payments.map(paymentMapper::toSummary);
    }

    @Cacheable(value = "payments", key = "'status:' + #status + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort")
    public Page<PaymentSummaryDTO> findByStatusBooking(BookingStatus status, Pageable pageable) {
        log.debug("Searching payments by booking status={}", status);

        Page<Payment> payments = paymentRepository.findByStatusBooking(status, pageable);
        log.info("Found {} payments with booking status={}", payments.getTotalElements(), status);

        return payments.map(paymentMapper::toSummary);
    }

    @Cacheable(value = "payment-details", key = "#id")
    public PaymentDetailDTO findById(Long id) {
        log.info("Fetching payment details for ID: {}", id);

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> {
                    log.debug("Payment details not found for ID: {}", id);
                    return new ResourceNotFoundException("Payment not found with id: " + id);
                });

        return paymentMapper.toDetail(payment);
    }

    @Transactional
    @CacheEvict(value = {"payments", "payment-details"}, allEntries = true)
    public void createReservationPayment(Booking booking, String receiptUrl) {
        log.info("Creating payment for booking ID: {}", booking.getId());

        BigDecimal signalAmount = booking.calculateRequiredDeposit();
        booking.setPayment(new Payment(signalAmount, receiptUrl, booking));

        log.info("Payment created for booking ID: {}. Signal amount: {}", booking.getId(), signalAmount);
    }

    private BigDecimal amount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
