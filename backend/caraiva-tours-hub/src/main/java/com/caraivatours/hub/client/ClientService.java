package com.caraivatours.hub.client;

import com.caraivatours.hub.client.dto.ClientDTO;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.EmailAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Resolves the customer associated with a booking.
 *
 * <p>Phone is the operational identity used to reuse an existing customer. E-mail and phone
 * collisions are rejected so two customer records are not accidentally merged during booking
 * creation or editing.</p>
 */
@RequiredArgsConstructor
@Slf4j
@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public Client findOrCreate(ClientDTO clientDTO) {
        log.debug("Looking up client by phone: {}", clientDTO.phone());

        if (clientDTO.email() != null && clientRepository.existsClientByEmail(clientDTO.email())) {
            throw new EmailAlreadyExistsException("The email " + clientDTO.email() + " already exists");
        }

        return clientRepository.findByPhone(clientDTO.phone())
                .map(existing -> {
                    log.debug("Existing client found, id={}", existing.getId());
                    return existing;
                })
                .orElseGet(() -> createClient(clientDTO));
    }

    public void updateClientData(Client client, String name, String phone) {
        if (name != null) {
            client.setName(name);
        }

        if (phone != null && !phone.equals(client.getPhone())) {
            if (clientRepository.existsByPhoneAndIdNot(phone, client.getId())) {
                throw new BadRequestException("Phone number already exists");
            }
            client.setPhone(phone);
        }
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
