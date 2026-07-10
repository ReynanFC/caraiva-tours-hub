package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.response.BookingDetailDTO;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.statushistory.StatusHistory;
import com.caraivatours.hub.booking.statushistory.dto.StatusHistoryDTO;
import com.caraivatours.hub.groupmember.GroupMember;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface BookingMapper {

    @Mapping(target = "clientName", source = "client.name")
    @Mapping(target = "tourName", source = "tour.name")
    @Mapping(target = "date", source = "customSchedule")
    @Mapping(target = "groupSize", source = "groupMembers", qualifiedByName = "toGroupSize")
    @Mapping(target = "totalPrice", expression = "java(booking.calculateTotalPrice())")
    @Mapping(target = "status", source = "currentStatus")
    BookingSummaryDTO toSummary(Booking booking);

    @Mapping(target = "summary", source = "booking")
    @Mapping(target = "members", source = "groupMembers", qualifiedByName = "mapGroupMembers")
    @Mapping(target = "commissionEarned", source = "financialData.commissionValue")
    @Mapping(target = "history", source = "statusHistory", qualifiedByName = "mapStatusHistory")
    BookingDetailDTO toDetail(Booking booking);

    @Named("mapGroupMembers")
    default Set<GroupMemberDTO> mapGroupMembers(Set<GroupMember> groupMembers) {
        if (groupMembers == null) {
            return Set.of();
        }
        return groupMembers.stream()
                .map(m -> new GroupMemberDTO(m.getName(), m.isLapChild()))
                .collect(Collectors.toSet());
    }

    @Named("mapStatusHistory")
    default Set<StatusHistoryDTO> mapStatusHistory(Set<StatusHistory> statusHistory) {
        if (statusHistory == null) {
            return Set.of();
        }
        return statusHistory.stream()
                .map(h -> new StatusHistoryDTO(
                    h.getPreviousStatus(),
                    h.getNewStatus(),
                    h.getChangeReason(),
                    h.getChangedAt(),
                    h.getUser().getUsername()
                ))
                .collect(Collectors.toSet());
    }

    @Named("toGroupSize")
    default int toGroupSize(Set<GroupMember> members) {
        return Booking.calculateTotalParticipants(members.size());
    }
}
