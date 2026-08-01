package com.caraivatours.hub.user.controller;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.jasper.JasperFillService;
import com.caraivatours.hub.jasper.JasperService;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.validation.IsAdmin;
import com.caraivatours.hub.user.UserService;
import com.caraivatours.hub.user.controller.docs.UserControllerDocs;
import com.caraivatours.hub.user.dto.request.ToggleUserEnabledDTO;
import com.caraivatours.hub.user.dto.request.UserChangePasswordDTO;
import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.request.UserUpdateDTO;
import com.caraivatours.hub.user.dto.response.UserHeaderProjection;
import com.caraivatours.hub.user.dto.response.UserProfileDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController implements UserControllerDocs {

    private final UserService userService;
    private final JasperFillService jasperFillService;
    private final JasperService jasperService;

    @IsAdmin
    @GetMapping
    public ResponseEntity<PagedResult<UserSummaryDTO>> findAll(
            @RequestParam(required = false, defaultValue = "") String search,
            @PageableDefault(size = 10, page = 0, sort = "userName", direction = Sort.Direction.ASC) Pageable pageable) {

        return ResponseEntity.ok(userService.findAll(search, pageable));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileDTO> findProfile(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {

        return ResponseEntity.ok(userService.findProfile(authenticatedUser.id()));
    }

    @IsAdmin
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileDTO> findProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findProfile(id));
    }

    @GetMapping("/me/header")
    public ResponseEntity<UserHeaderProjection> findHeaderData(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {

        return ResponseEntity.ok(userService.findHeaderDataById(authenticatedUser.id()));
    }

    @GetMapping("/finance/{id}")
    public ResponseEntity<Resource> generatePdfCommission(@PathVariable Long id,
                                                          @RequestParam int month, @RequestParam int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.plusMonths(1);

        Map<String, Object> params = new HashMap<>();
        params.put("P_USER_ID", id);
        params.put("P_PERIOD_START", Timestamp.valueOf(start.atStartOfDay()));
        params.put("P_PERIOD_END", Timestamp.valueOf(end.atStartOfDay()));

        JasperPrint print = jasperFillService.fillReport("comissao.jasper", params);
        Resource pdf = jasperService.generatePdfResource(print);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=comissao-" + id + "pdf")
                .body(pdf);
    }

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

    @PutMapping("/me")
    public ResponseEntity<UserSummaryDTO> updateProfile(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestBody @Valid UserUpdateDTO userUpdateDTO) {

        UserSummaryDTO response = userService.updateUser(authenticatedUser.id(), userUpdateDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{uuid}/password")
    public ResponseEntity<UserSummaryDTO> changePassword(
            @PathVariable UUID uuid,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestBody @Valid UserChangePasswordDTO changePasswordDTO) {

        validateUserAccess(uuid, authenticatedUser);

        UserSummaryDTO response = userService.changePassword(authenticatedUser.id(), changePasswordDTO);
        return ResponseEntity.ok(response);
    }

    @IsAdmin
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserSummaryDTO> changeEnabled(
            @PathVariable Long id,
            @RequestBody @Valid ToggleUserEnabledDTO userEnabledDTO) {

        return ResponseEntity.ok(userService.changeEnabled(id, userEnabledDTO));
    }

    /**
     * Validates whether the UUID provided in the request URL matches the authenticated user's UUID.
     * This prevention mechanism ensures a logged-in user cannot manipulate third-party resources.
     *
     * @param urlUuid           the {@link UUID} extracted from the request path variable.
     * @param authenticatedUser the currently authenticated {@link AuthenticatedUser} context.
     * @throws AccessDeniedException if the URL UUID does not match the authenticated user's UUID.
     */
    private void validateUserAccess(UUID urlUuid, AuthenticatedUser authenticatedUser) {
        if (!authenticatedUser.uuid().equals(urlUuid)) {
            throw new AccessDeniedException("Você não tem permissão para realizar esta operação.");
        }
    }
}