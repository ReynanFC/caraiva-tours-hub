package com.caraivatours.hub.payment.controller;

import com.caraivatours.hub.payment.PaymentService;
import com.caraivatours.hub.payment.controller.docs.PaymentControllerDocs;
import com.caraivatours.hub.payment.dto.PaymentDetailDTO;
import com.caraivatours.hub.payment.dto.PaymentSummaryDTO;
import com.caraivatours.hub.payment.dto.PaymentOverviewDTO;
import com.caraivatours.hub.payment.dto.ReservationPaymentDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.shared.validation.IsAdmin;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController implements PaymentControllerDocs {

    private final PaymentService paymentService;

    @IsAdmin
    @GetMapping("/overview")
    public ResponseEntity<PaymentOverviewDTO> overview() {
        return ResponseEntity.ok(paymentService.getOverview());
    }

    @IsAdmin
    @GetMapping("/reservations")
    public ResponseEntity<Page<ReservationPaymentDTO>> searchReservations(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false, defaultValue = "") String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(paymentService.searchReservations(status, search, pageable));
    }

    @IsAdmin
    @GetMapping
    public ResponseEntity<Page<PaymentSummaryDTO>> findAllByFilters(
            @RequestParam(required = false) Long idPayment,
            @RequestParam(required = false) String nameClient,
            @PageableDefault(size = 10, sort = "paidAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(paymentService.findAllByNameClientOrId(idPayment, nameClient, pageable));
    }

    @IsAdmin
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDetailDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.findById(id));
    }

    @IsAdmin
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<PaymentSummaryDTO>> findByBookingStatus(
            @PathVariable BookingStatus status,
            @PageableDefault(size = 10, sort = "paidAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(paymentService.findByStatusBooking(status, pageable));
    }
}
