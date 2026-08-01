package com.caraivatours.hub.booking.controller;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.booking.BookingService;
import com.caraivatours.hub.booking.controller.docs.BookingControllerDocs;
import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.request.UpdateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingDetailDTO;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.jasper.JasperFillService;
import com.caraivatours.hub.jasper.JasperService;
import com.caraivatours.hub.shared.dto.PagedResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController implements BookingControllerDocs {

    private final BookingService bookingService;
    private final JasperFillService jasperFillService;
    private final JasperService jasperService;

    @GetMapping
    public ResponseEntity<PagedResult<BookingSummaryDTO>> findAll(
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(bookingService.findAll(search.trim(), pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<PagedResult<BookingSummaryDTO>> findByStatus(
            @PathVariable BookingStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(bookingService.findByStatus(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDetailDTO> findDetails(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.findDetailsBooking(id));
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<Resource> generateReceipt(@PathVariable Long id) {
        Map<String, Object> params = new HashMap<>();
        params.put("bookingId", id);

        JasperPrint print = jasperFillService.fillReport("nota.jasper", params);
        Resource pdf = jasperService.generatePdfResource(print);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=recibo-" + id + "pdf")
                .body(pdf);
    }

    @PostMapping
    public ResponseEntity<BookingSummaryDTO> create(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestBody @Valid CreateBookingRequest request) {
        BookingSummaryDTO response = bookingService.createBooking(authenticatedUser.id(), request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<BookingSummaryDTO> confirm(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return ResponseEntity.ok(bookingService.confirmBooking(id, authenticatedUser.id()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BookingSummaryDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateBookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }
}
