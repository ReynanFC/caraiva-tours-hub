package com.caraivatours.hub.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AccountCredentialsDTO(

        @NotBlank
        @Email(message = "Invalid email format")
        @Size(max = 100)
        String email,

        @NotBlank
        @Size(max = 255)
        String password
) {}
