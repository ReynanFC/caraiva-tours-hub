package com.caraivatours.hub.client;

import com.caraivatours.hub.client.dto.ClientDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Slf4j
@Service
public class ClientService {

    private final ClientRepository clientRepository;

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
}