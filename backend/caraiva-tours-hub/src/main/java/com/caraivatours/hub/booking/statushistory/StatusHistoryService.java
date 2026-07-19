package com.caraivatours.hub.booking.statushistory;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.booking.event.BookingStatusChangedEvent;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatusHistoryService {

    private final StatusHistoryRepository statusHistoryRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @EventListener
    @Transactional
    public void registerStatusChange(BookingStatusChangedEvent event) {
        log.info("Recording status transition for booking ID: {} from {} to {}",
                event.bookingId(), event.previousStatus(), event.newStatus());

        Booking booking = bookingRepository.findById(event.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + event.bookingId()));

        User user = userRepository.findById(event.changedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + event.changedByUserId()));

        StatusHistory history = new StatusHistory();
        history.setBooking(booking);
        history.setUser(user);
        history.setPreviousStatus(event.previousStatus());
        history.setNewStatus(event.newStatus());
        history.setChangeReason(event.reason());
        booking.getStatusHistory().add(history);

        statusHistoryRepository.save(history);
        log.debug("Status history persisted for booking ID: {}", event.bookingId());
    }
}
