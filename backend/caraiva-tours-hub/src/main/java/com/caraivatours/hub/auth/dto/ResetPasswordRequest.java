package com.caraivatours.hub.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest (
        @NotBlank
        String token,

        @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{12,}$",
        message = "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character"
        )
        String newPassword
){}
