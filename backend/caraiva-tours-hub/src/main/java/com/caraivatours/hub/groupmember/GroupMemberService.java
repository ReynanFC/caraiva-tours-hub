package com.caraivatours.hub.groupmember;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;

    @Transactional
    public Set<GroupMember> createForBooking(Booking booking, Set<GroupMemberDTO> memberDtos) {
        if (memberDtos == null || memberDtos.isEmpty()) {
            log.debug("No group members to create for booking ID: {}", booking.getId());
            return Set.of();
        }

        log.info("Creating {} group members for booking ID: {}", memberDtos.size(), booking.getId());

        Set<GroupMember> members = memberDtos.stream()
                .map(dto -> toEntity(dto, booking))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<GroupMember> savedMembers = new LinkedHashSet<>();
        groupMemberRepository.saveAll(members).forEach(savedMembers::add);

        log.debug("Created {} group members for booking ID: {}", savedMembers.size(), booking.getId());
        return savedMembers;
    }

    private GroupMember toEntity(GroupMemberDTO dto, Booking booking) {
        GroupMember member = new GroupMember(dto.name(), dto.isLapChild());
        member.setBooking(booking);
        return member;
    }
}
