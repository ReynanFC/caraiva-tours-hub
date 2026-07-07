package com.caraivatours.hub.groupmember.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GroupMemberDTO(
        @NotBlank(message = "Group member name is required.")
        @Size(max = 100, message = "Group member name must not exceed 100 characters.")
        String name,

        boolean isLapChild
) {}
