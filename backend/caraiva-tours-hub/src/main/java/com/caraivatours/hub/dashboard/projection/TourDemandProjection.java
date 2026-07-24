package com.caraivatours.hub.dashboard.projection;

public interface TourDemandProjection {
    Long getTourId();
    String getTourName();
    Long getBookingCount();
}
