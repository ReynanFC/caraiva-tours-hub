package com.caraivatours.hub.booking.dto.response;

import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.booking.statushistory.dto.StatusHistoryDTO;
import com.caraivatours.hub.pickuplocation.dto.PickupDTO;

import java.math.BigDecimal;
import java.util.List;

public record BookingDetailDTO(
        BookingSummaryDTO summary,
        List<GroupMemberDTO> members,
        BigDecimal commissionEarned,
        List<StatusHistoryDTO> history,
        PickupDTO pickup
) {}
