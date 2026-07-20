package com.caraivatours.hub.client;

import com.caraivatours.hub.client.dto.ClientDTO;
import com.caraivatours.hub.client.dto.response.ClientDetailsDTO;
import com.caraivatours.hub.client.dto.response.ClientTourHistoryDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
@Service
public class ClientService {

    private final ClientRepository clientRepository;

    @Cacheable(value = "client-details", key = "#id")
    public ClientDetailsDTO findDetails(Long id) {
        log.info("Retrieving client details with id: {}", id);

        Client client = findById(id);
        return new ClientDetailsDTO(
                client.getId(), client.getName(), client.getPhone(), client.getEmail(), client.getCreatedAt()
        );
    }

    @Cacheable(value = "client-tour-history", key = "#id + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort")
    public PagedResult<ClientTourHistoryDTO> findTourHistory(Long id, Pageable pageable) {
        log.info("Retrieving paginated tour history for client id: {}", id);

        findById(id);
        return PagedResult.from(clientRepository.findTourHistoryById(id, pageable));
    }

    @Transactional
    public Client findOrCreate(ClientDTO clientDTO) {
        log.debug("Looking up client by phone: {}", clientDTO.phone());

        return clientRepository.findByPhone(clientDTO.phone())
                .map(existing -> {
                    log.debug("Existing client found, id={}", existing.getId());
                    return existing;
                })
                .orElseGet(() -> createClient(clientDTO));
    }

    private Client createClient(ClientDTO clientDTO) {
        log.info("Creating new client with phone: {}", clientDTO.phone());

        Client saved = clientRepository.save(
                new Client(clientDTO.name(), clientDTO.phone(), clientDTO.email())
        );

        log.info("Client created, id={}", saved.getId());
        return saved;
    }

    private Client findById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));
    }
}
