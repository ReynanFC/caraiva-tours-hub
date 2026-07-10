package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientRepository;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourRepository;
import com.caraivatours.hub.tour.entity.Tour;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;

    public BookingSummaryDTO createBooking(CreateBookingRequest createBookingDTO) {

        Tour tour = tourRepository.findById(createBookingDTO.tourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + createBookingDTO.tourId()));
    return null;
    }
}
