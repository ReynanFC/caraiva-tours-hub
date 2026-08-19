package com.caraivatours.hub.groupmember.controller;

import com.caraivatours.hub.groupmember.GroupMemberService;
import com.caraivatours.hub.groupmember.controller.docs.GroupMemberDocs;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class GroupMemberController implements GroupMemberDocs {

    private final GroupMemberService groupMemberService;

    @GetMapping("/{bookingId}/group-members")
    public ResponseEntity<List<GroupMemberDTO>> findGroupMembers(@PathVariable("bookingId") Long bookingId) {
        return ResponseEntity.ok(groupMemberService.findGroupMembers(bookingId));
    }
}
