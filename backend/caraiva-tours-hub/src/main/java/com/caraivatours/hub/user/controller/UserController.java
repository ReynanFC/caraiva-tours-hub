package com.caraivatours.hub.user.controller;

import com.caraivatours.hub.shared.validation.IsAdmin;
import com.caraivatours.hub.user.UserService;
import com.caraivatours.hub.user.dto.request.ToggleUserEnabledDTO;
import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.request.UserUpdateDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @IsAdmin
    @PostMapping
    public ResponseEntity<UserSummaryDTO> createUser(@RequestBody @Valid UserRegistrationDTO userRegistrationDTO) {

        UserSummaryDTO response = userService.createUser(userRegistrationDTO);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

//    @PutMapping("/me")
//    public ResponseEntity<UserSummaryDTO> updateUser(
//            , @RequestBody @Valid UserUpdateDTO userUpdateDTO) {
//
//        return ResponseEntity.ok(userService.updateUser(id, userUpdateDTO));
//    }

    @IsAdmin
    @PatchMapping("/{id}")
    public ResponseEntity<UserSummaryDTO> changeEnabled(
          @PathVariable Long id, @RequestBody @Valid ToggleUserEnabledDTO userEnabledDTO) {

        return ResponseEntity.ok(userService.changeEnabled(id, userEnabledDTO));
    }


//    public Response<UserSummaryDTO> changePassword(Long id, )
}
