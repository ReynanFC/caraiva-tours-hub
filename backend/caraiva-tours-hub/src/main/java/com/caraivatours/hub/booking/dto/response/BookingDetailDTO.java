package com.caraivatours.hub.booking.dto.response;

import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.booking.statushistory.dto.StatusHistoryDTO;

import java.math.BigDecimal;
import java.util.Set;

public record BookingDetailDTO(
        BookingSummaryDTO summary,
        Set<GroupMemberDTO> members,
        BigDecimal commissionEarned,
        Set<StatusHistoryDTO> history
) {}
