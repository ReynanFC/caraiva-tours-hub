package com.caraivatours.hub.groupmember;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Creates and reads the participants owned by a booking aggregate.
 *
 * <p>The {@code lapChild} flag is preserved for operational display and excludes that member
 * from the booking's price and commission calculations.
 * Entity creation only assembles the relationship; cascade persistence is controlled by the
 * booking.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<GroupMemberDTO> findGroupMembers(Long bookingId) {
        log.info("Fetching group members for Booking ID: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        booking.validateBookingStateForModification();

        List<GroupMember> members = groupMemberRepository.findByBookingIdOrderByIdAsc(bookingId);
        log.debug("Found {} group members for Booking ID: {}", members.size(), bookingId);

        return members.stream()
                .map(member -> new GroupMemberDTO(member.getName(), member.isLapChild()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GroupMember> createForBooking(Booking booking, List<GroupMemberDTO> memberDtos) {
        if (memberDtos == null || memberDtos.isEmpty()) {
            log.debug("No group members to create.");
            return List.of();
        }

        log.info("Creating {} group members.", memberDtos.size());

        return memberDtos.stream()
                .map(dto -> toEntity(dto, booking))
                .toList();
    }

    private GroupMember toEntity(GroupMemberDTO dto, Booking booking) {
        GroupMember member = new GroupMember(dto.name(), dto.isLapChild());
        member.setBooking(booking);
        return member;
    }
}
