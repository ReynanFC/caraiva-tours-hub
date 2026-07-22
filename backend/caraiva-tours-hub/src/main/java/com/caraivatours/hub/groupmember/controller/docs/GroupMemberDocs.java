package com.caraivatours.hub.groupmember.controller.docs;

import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Set;

@Tag(name = "GroupMembers", description = "Endpoints for found members")
public interface GroupMemberDocs {

    @Operation(summary = "List booking group members", responses = {
            @ApiResponse(responseCode = "200", description = "Group members retrieved", content = @Content(schema = @Schema(implementation = GroupMemberDTO.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content)
    })
    ResponseEntity<Set<GroupMemberDTO>> findGroupMembers(@Parameter(description = "Booking ID") Long bookingId);
}
