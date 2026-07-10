package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.groupmember.GroupMember;
import org.mapstruct.*;

import java.util.Set;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface BookingMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "clientName", source = "client.name")
    @Mapping(target = "tourName", source = "tour.name")
    @Mapping(target = "date", source = "customSchedule")
    @Mapping(target = "groupSize", source = "groupMembers", qualifiedByName = "toGroupSize")    @Mapping(target = "totalPrice", expression = "java(booking.calculateTotalPrice())")
    @Mapping(target = "status", source = "currentStatus")
    BookingSummaryDTO toSummary(Booking booking);

    @Named("toGroupSize")
    default int toGroupSize(Set<GroupMember> members) {
        return Booking.calculateTotalParticipants(members.size());
    }
}
