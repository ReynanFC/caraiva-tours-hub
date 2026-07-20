package com.caraivatours.hub.client.controller.docs;

import com.caraivatours.hub.client.dto.response.ClientDetailsDTO;
import com.caraivatours.hub.client.dto.response.ClientTourHistoryDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

@Tag(name = "Clients", description = "Endpoints for consulting client data and tour history")
public interface ClientControllerDocs {

    @Operation(summary = "Get client details", description = "Returns the registered data for a client.", responses = {
            @ApiResponse(responseCode = "200", description = "Client found", content = @Content(schema = @Schema(implementation = ClientDetailsDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
            @ApiResponse(responseCode = "404", description = "Client not found", content = @Content)
    })
    ResponseEntity<ClientDetailsDTO> findDetails(
            @Parameter(description = "Client identifier", required = true) Long id
    );

    @Operation(summary = "Get client tour history", description = "Returns a paginated history of the client's tour bookings.", responses = {
            @ApiResponse(responseCode = "200", description = "Tour history retrieved", content = @Content(schema = @Schema(implementation = PagedResult.class))),
            @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
            @ApiResponse(responseCode = "404", description = "Client not found", content = @Content)
    })
    ResponseEntity<PagedResult<ClientTourHistoryDTO>> findTourHistory(
            @Parameter(description = "Client identifier", required = true) Long id,
            @ParameterObject Pageable pageable
    );
}
