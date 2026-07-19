package com.caraivatours.hub.groupmember;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupMemberService {

    @Transactional(readOnly = true)
    public Set<GroupMember> createForBooking(Booking booking, Set<GroupMemberDTO> memberDtos) {
        if (memberDtos == null || memberDtos.isEmpty()) {
            log.debug("No group members to create.");
            return Collections.emptySet();
        }

        log.info("Creating {} group members.", memberDtos.size());

        return memberDtos.stream()
                .map(dto -> toEntity(dto, booking))
                .collect(Collectors.toCollection(HashSet::new));
    }

    private GroupMember toEntity(GroupMemberDTO dto, Booking booking) {
        GroupMember member = new GroupMember(dto.name(), dto.isLapChild());
        member.setBooking(booking);
        return member;
    }
}
