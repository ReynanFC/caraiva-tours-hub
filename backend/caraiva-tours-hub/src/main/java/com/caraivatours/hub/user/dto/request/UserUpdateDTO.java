package com.caraivatours.hub.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
        @Size(min = 3, max = 50) String userName,
        @Email @Size(max = 100) String email,
        @Size(max = 255) String pixKey
) {}
