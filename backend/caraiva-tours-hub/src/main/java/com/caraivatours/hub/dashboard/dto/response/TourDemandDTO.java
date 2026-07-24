package com.caraivatours.hub.dashboard.dto.response;

public record TourDemandDTO(Long tourId, String tourName, long bookingCount, double percentage) {}
