package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.groupmember.GroupMember;

public final class GroupMemberTestDataBuilder {

    private Long id;
    private String name = "Pedro dos Santos";
    private boolean lapChild;
    private Booking booking;

    private GroupMemberTestDataBuilder() {
    }

    public static GroupMemberTestDataBuilder aGroupMember() {
        return new GroupMemberTestDataBuilder();
    }

    public GroupMember build() {
        GroupMember groupMember = new GroupMember(name, lapChild);
        groupMember.setId(id);
        groupMember.setBooking(booking);
        return groupMember;
    }
}
