package com.caraivatours.hub.client.controller;

import com.caraivatours.hub.client.ClientService;
import com.caraivatours.hub.client.controller.docs.ClientControllerDocs;
import com.caraivatours.hub.client.dto.response.ClientDetailsDTO;
import com.caraivatours.hub.client.dto.response.ClientTourHistoryDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController implements ClientControllerDocs {

    private final ClientService clientService;

    @GetMapping("/{id}")
    public ResponseEntity<ClientDetailsDTO> findDetails(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findDetails(id));
    }

    @GetMapping("/{id}/tour-history")
    public ResponseEntity<PagedResult<ClientTourHistoryDTO>> findTourHistory(
            @PathVariable Long id,
            @PageableDefault(size = 10, sort = "customSchedule", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(clientService.findTourHistory(id, pageable));
    }
}
