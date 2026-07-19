package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.payment.dto.PaymentDetailDTO;
import com.caraivatours.hub.payment.dto.PaymentSummaryDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
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

    @Cacheable(
            value = "payments",
            key = "'search:' + #idPayment + ':' + #nameClient + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort"
    )
    public PagedResult<PaymentSummaryDTO> findAllByNameClientOrId(
            Long idPayment,
            String nameClient,
            Pageable pageable
    ) {
        log.debug("Searching payments by idPayment={}, nameClient={}, page={}",
                idPayment, nameClient, pageable);

        Page<Payment> payments = paymentRepository.findAllByFilters(idPayment, nameClient, pageable);

        log.info("Found {} payments matching filters (idPayment={}, nameClient={})",
                payments.getTotalElements(), idPayment, nameClient);

        return PagedResult.from(payments.map(paymentMapper::toSummary));
    }

    @Cacheable(
            value = "payments",
            key = "'status:' + #status + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort"
    )
    public PagedResult<PaymentSummaryDTO> findByStatusBooking(
            BookingStatus status,
            Pageable pageable
    ) {
        log.debug("Searching payments by booking status={}", status);

        Page<Payment> payments = paymentRepository.findByStatusBooking(status, pageable);

        log.info("Found {} payments with booking status={}",
                payments.getTotalElements(), status);

        return PagedResult.from(payments.map(paymentMapper::toSummary));
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
}
