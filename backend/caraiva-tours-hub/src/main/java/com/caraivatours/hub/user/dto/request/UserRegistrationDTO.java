package com.caraivatours.hub.user.dto.request;

import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.shared.validation.ValueOfEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegistrationDTO(

   @NotBlank
   @Size(min = 3, max = 50)
   String userName,

   @NotBlank
   @Size(min = 3, max = 100)
   String fullName,

   @NotBlank
   @Email
   @Size(max = 100)
   String email,

   @Pattern(
           regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
           message = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
   )
   String password,

   @Size(max = 255)
   String pixKey,

   @ValueOfEnum(enumClass = UserRole.class)
   String role
) {}
