package com.caraivatours.hub.client.dto;

import com.caraivatours.hub.shared.utils.PhoneFormatter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClientDTO(
        @NotBlank(message = "Client name is required.")
        @Size(max = 100, message = "Client name must not exceed 100 characters.")
        String name,

        @NotBlank(message = "Phone number is required.")
        @Size(max = 20, message = "Phone number must not exceed 20 characters.")
        @Pattern(regexp = "^(\\(?[1-9]{2}\\)?\\s?)?(9?[0-9]{4})-?([0-9]{4})$", message = "Invalid phone format.")
        String phone,

        @Email(message = "Email must be a valid email address.")
        @Size(max = 100, message = "Email must not exceed 100 characters.")
        String email
) {
        public ClientDTO {
                phone = PhoneFormatter.format(phone);
                email = (email == null || email.isBlank())
                        ? null : email.trim();
        }
}
