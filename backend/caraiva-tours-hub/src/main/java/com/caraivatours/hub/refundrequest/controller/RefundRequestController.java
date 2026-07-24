package com.caraivatours.hub.refundrequest.controller;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.refundrequest.RefundRequestService;
import com.caraivatours.hub.refundrequest.controller.docs.RefundRequestControllerDocs;
import com.caraivatours.hub.refundrequest.dto.request.CreateRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.request.ResolveRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.response.RefundRequestResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/refund-requests")
@RequiredArgsConstructor
public class
RefundRequestController implements RefundRequestControllerDocs {

    private final RefundRequestService refundRequestService;

    @PostMapping
    public ResponseEntity<RefundRequestResponseDTO> create(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestBody @Valid CreateRefundRequestDTO request) {
        RefundRequestResponseDTO response = refundRequestService.create(authenticatedUser.id(), request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PatchMapping("/{id}/resolution")
    public ResponseEntity<RefundRequestResponseDTO> resolve(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestBody @Valid ResolveRefundRequestDTO request) {
        return ResponseEntity.ok(refundRequestService.resolve(id, authenticatedUser.id(), request));
    }
}
