package com.caraivatours.hub.refundrequest;

import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.event.BookingStatusChangedEvent;
import com.caraivatours.hub.booking.statushistory.StatusHistoryRepository;
import com.caraivatours.hub.refundrequest.dto.request.CreateRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.request.ResolveRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.response.RefundBookingOptionDTO;
import com.caraivatours.hub.refundrequest.dto.response.RefundRequestResponseDTO;
import com.caraivatours.hub.refundrequest.enums.RefundStatus;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Coordinates the cancellation/refund review workflow.
 *
 * <p>An employee may request cancellation only for their own booking and only one request may be
 * pending. Creation moves the booking to {@code CANCEL_REQUEST}; only an administrator can decide
 * it, and approval moves the booking to {@code CANCELLED}. Rejection restores the status held by
 * the booking before the cancellation request.</p>
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RefundRequestService {

    private final RefundRequestRepository refundRequestRepository;
    private final RefundRequestMapper refundRequestMapper;
    private final BookingRepository bookingRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    public PagedResult<RefundRequestResponseDTO> findAll(Pageable pageable) {
        log.info("Fetching refund request history with pagination: {}", pageable);
        Page<RefundRequestResponseDTO> refundRequests = refundRequestRepository.findAll(pageable)
                .map(refundRequestMapper::toResponse);
        return PagedResult.from(refundRequests);
    }

    public PagedResult<RefundRequestResponseDTO> findMine(Long requesterId, Pageable pageable) {
        log.info("Fetching refund request history for user ID: {} with pagination: {}", requesterId, pageable);
        Page<RefundRequestResponseDTO> refundRequests = refundRequestRepository
                .findAllByRequestedByUserId(requesterId, pageable)
                .map(refundRequestMapper::toResponse);
        return PagedResult.from(refundRequests);
    }

    public List<RefundBookingOptionDTO> findMyBookingOptions(Long requesterId) {
        userService.findById(requesterId);
        return bookingRepository.findRefundOptionsByAttendantId(
                requesterId,
                List.of(BookingStatus.CANCELLED, BookingStatus.CANCEL_REQUEST),
                RefundStatus.PENDING
        );
    }

    @Transactional
    @CacheEvict(value = {"bookings", "booking-details"}, allEntries = true)
    /**
     * Opens a refund request for a non-admin user and moves the related booking to cancellation review.
     */
    public RefundRequestResponseDTO create(Long requesterId, CreateRefundRequestDTO request) {
        log.info("Creating refund request for booking ID: {} by user ID: {}", request.bookingId(), requesterId);
        User requester = userService.findById(requesterId);

        if (isAdmin(requester)) {
            log.warn("Refund request denied: administrator user ID {} attempted to create one", requesterId);
            throw new BadRequestException("Administrators cannot request refunds");
        }

        Booking booking = findBooking(request.bookingId());
        if (!booking.getAttendant().getId().equals(requesterId)) {
            log.warn("Refund request denied: booking ID {} does not belong to user ID {}",
                    booking.getId(), requesterId);
            throw new BadRequestException("You can only request refunds for your own bookings");
        }
        if (booking.getCurrentStatus() == BookingStatus.CANCELLED
                || booking.getCurrentStatus() == BookingStatus.CANCEL_REQUEST) {
            log.warn("Refund request denied for booking ID {} due to current status {}",
                    booking.getId(), booking.getCurrentStatus());
            throw new BadRequestException("This booking already has a cancellation in progress or has been cancelled");
        }
        if (refundRequestRepository.existsByBookingIdAndRefundStatus(booking.getId(), RefundStatus.PENDING)) {
            log.warn("Refund request denied: booking ID {} already has a pending request", booking.getId());
            throw new BadRequestException("This booking already has a pending refund request");
        }

        RefundRequest refundRequest = new RefundRequest(request.reason().trim(), booking, requester);
        RefundRequest savedRequest = refundRequestRepository.save(refundRequest);
        changeBookingStatus(booking, BookingStatus.CANCEL_REQUEST, requesterId, "Refund requested");
        log.info("Refund request ID {} created; booking ID {} moved to {}",
                savedRequest.getId(), booking.getId(), BookingStatus.CANCEL_REQUEST);

        return refundRequestMapper.toResponse(savedRequest);
    }

    @Transactional
    @CacheEvict(value = {"bookings", "booking-details"}, allEntries = true)
    /**
     * Lets an administrator approve or reject a pending request; approval finalizes the booking cancellation.
     */
    public RefundRequestResponseDTO resolve(Long refundRequestId, Long adminId, ResolveRefundRequestDTO request) {
        log.info("Resolving refund request ID: {} by user ID: {} with status: {}",
                refundRequestId, adminId, request.refundStatus());
        User admin = userService.findById(adminId);

        if (!isAdmin(admin)) {
            log.warn("Refund request resolution denied: non-admin user ID {}", adminId);
            throw new BadRequestException("Only administrators can resolve refund requests");
        }

        if (request.refundStatus() == RefundStatus.PENDING) {
            log.warn("Refund request ID {} cannot be resolved with PENDING status", refundRequestId);
            throw new BadRequestException("A refund request can only be approved or rejected");
        }

        RefundRequest refundRequest = refundRequestRepository.findById(refundRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Refund request not found with ID: " + refundRequestId));
        if (refundRequest.getRefundStatus() != RefundStatus.PENDING) {
            log.warn("Refund request ID {} has already been resolved with status {}",
                    refundRequestId, refundRequest.getRefundStatus());
            throw new BadRequestException("This refund request has already been resolved");
        }

        refundRequest.resolve(request.refundStatus(), request.adminObservation(), admin);

        if (request.refundStatus() == RefundStatus.APPROVED) {
            changeBookingStatus(refundRequest.getBooking(), BookingStatus.CANCELLED, adminId, "Refund request approved");
            log.info("Refund request ID {} approved; booking ID {} moved to {}",
                    refundRequestId, refundRequest.getBooking().getId(), BookingStatus.CANCELLED);
        } else {
            Booking booking = refundRequest.getBooking();
            BookingStatus previousStatus = statusHistoryRepository
                    .findTopByBookingIdAndNewStatusOrderByIdDesc(booking.getId(), BookingStatus.CANCEL_REQUEST)
                    .map(history -> history.getPreviousStatus())
                    .orElseThrow(() -> new BadRequestException(
                            "Previous booking status not found for refund request ID: " + refundRequestId
                    ));

            changeBookingStatus(booking, previousStatus, adminId, "Refund request rejected");
            log.info("Refund request ID {} rejected; booking ID {} restored to {}",
                    refundRequestId, booking.getId(), previousStatus);
        }

        return refundRequestMapper.toResponse(refundRequest);
    }

    private Booking findBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    private boolean isAdmin(User user) {
        return user.getPermission().stream()
                .anyMatch(permission -> permission.getRole() == UserRole.ADMIN);
    }

    private void changeBookingStatus(Booking booking, BookingStatus newStatus, Long userId, String reason) {
        BookingStatus previousStatus = booking.getCurrentStatus();
        booking.setCurrentStatus(newStatus);
        bookingRepository.save(booking);
        log.debug("Booking ID {} status changed from {} to {}", booking.getId(), previousStatus, newStatus);
        eventPublisher.publishEvent(new BookingStatusChangedEvent(
                booking.getId(), previousStatus, newStatus, userId, reason
        ));
    }

}
