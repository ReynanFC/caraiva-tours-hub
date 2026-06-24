package com.caraivatours.hub.user.dto.response;

public interface UserSummaryProjection {
    String getUserName();
    String getEmail();
    String getRole();
    Boolean getEnabled();
}
