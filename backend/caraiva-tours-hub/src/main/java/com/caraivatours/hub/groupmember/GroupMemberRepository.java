package com.caraivatours.hub.groupmember;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    Set<GroupMember> findByBookingId(Long bookingId);
}
