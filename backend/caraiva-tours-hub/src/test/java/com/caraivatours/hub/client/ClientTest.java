package com.caraivatours.hub.client;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.client.dto.ClientDTO;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static com.caraivatours.hub.support.fixtures.ClientTestDataBuilder.aClient;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Client integration tests")
class ClientTest extends AbstractIntegrationTest {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientService clientService;

    @PersistenceContext
    private EntityManager entityManager;

    @Nested
    @DisplayName("ClientRepository")
    class ClientRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should save and find a client by id")
            void shouldSaveAndFindClientById() {
                Client saved = saveClient(aClient().build());
                entityManager.clear();

                assertThat(clientRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(client -> {
                            assertThat(client.getName()).isEqualTo("João dos Santos");
                            assertThat(client.getPhone()).isEqualTo("+55 73 99999-0001");
                            assertThat(client.getEmail()).isEqualTo("joao.santos@example.com");
                            assertThat(client.getCreatedAt()).isNotNull();
                        });
            }

            @Test
            @DisplayName("should allow a client without email")
            void shouldAllowClientWithoutEmail() {
                Client saved = saveClient(aClient()
                        .withPhone("+55 73 99999-0002")
                        .withEmail(null)
                        .build());
                entityManager.clear();

                assertThat(clientRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .extracting(Client::getEmail)
                        .isNull();
            }

            @Test
            @DisplayName("should reject duplicated phone")
            void shouldRejectDuplicatedPhone() {
                saveClient(aClient().build());

                assertThatThrownBy(() -> saveClient(aClient()
                        .withName("Maria da Silva")
                        .withEmail("maria.silva@example.com")
                        .build()))
                        .isInstanceOf(DataIntegrityViolationException.class);
            }

            @Test
            @DisplayName("should reject duplicated email")
            void shouldRejectDuplicatedEmail() {
                saveClient(aClient().build());

                assertThatThrownBy(() -> saveClient(aClient()
                        .withName("Maria da Silva")
                        .withPhone("+55 73 99999-0002")
                        .build()))
                        .isInstanceOf(DataIntegrityViolationException.class);
            }
        }

        @Nested
        @DisplayName("findByPhone")
        class FindByPhoneTests {

            @Test
            @DisplayName("should return the client with the exact phone")
            void shouldReturnClientByPhone() {
                Client expected = saveClient(aClient().build());

                assertThat(clientRepository.findByPhone("+55 73 99999-0001"))
                        .contains(expected);
            }

            @Test
            @DisplayName("should return empty when phone does not exist")
            void shouldReturnEmptyWhenPhoneDoesNotExist() {
                assertThat(clientRepository.findByPhone("+55 73 90000-0000")).isEmpty();
            }
        }

        @Nested
        @DisplayName("existsByPhoneAndIdNot")
        class ExistsByPhoneAndIdNotTests {

            @Test
            @DisplayName("should find the phone when it belongs to another client")
            void shouldFindPhoneOwnedByAnotherClient() {
                Client owner = saveClient(aClient().build());
                Client other = saveClient(aClient()
                        .withName("Maria da Silva")
                        .withPhone("+55 73 99999-0002")
                        .withEmail("maria.silva@example.com")
                        .build());

                assertThat(clientRepository.existsByPhoneAndIdNot(owner.getPhone(), other.getId()))
                        .isTrue();
            }

            @Test
            @DisplayName("should ignore the client that already owns the phone")
            void shouldIgnoreCurrentClient() {
                Client owner = saveClient(aClient().build());

                assertThat(clientRepository.existsByPhoneAndIdNot(owner.getPhone(), owner.getId()))
                        .isFalse();
            }

            @Test
            @DisplayName("should return false when no client owns the phone")
            void shouldReturnFalseForAvailablePhone() {
                Client client = saveClient(aClient().build());

                assertThat(clientRepository.existsByPhoneAndIdNot(
                        "+55 73 90000-0000",
                        client.getId()
                )).isFalse();
            }
        }
    }

    @Nested
    @DisplayName("ClientService")
    class ClientServiceTests {

        @Nested
        @DisplayName("findOrCreate")
        class FindOrCreateTests {

            @Test
            @DisplayName("should return the existing client identified by phone")
            void shouldReturnExistingClient() {
                Client existing = saveClient(aClient().build());
                ClientDTO request = new ClientDTO(
                        "Nome recebido novamente",
                        existing.getPhone(),
                        "novo.email@example.com"
                );

                Client result = clientService.findOrCreate(request);

                assertThat(result.getId()).isEqualTo(existing.getId());
                assertThat(result.getName()).isEqualTo("João dos Santos");
                assertThat(result.getEmail()).isEqualTo("joao.santos@example.com");
                assertThat(clientRepository.count()).isEqualTo(1);
            }

            @Test
            @DisplayName("should create a client when phone is not registered")
            void shouldCreateClientWhenPhoneIsNotRegistered() {
                ClientDTO request = new ClientDTO(
                        "Maria da Silva",
                        "+55 73 99999-0002",
                        "maria.silva@example.com"
                );

                Client result = clientService.findOrCreate(request);
                clientRepository.flush();

                assertThat(result.getId()).isNotNull();
                assertThat(result.getName()).isEqualTo("Maria da Silva");
                assertThat(result.getPhone()).isEqualTo("+55 73 99999-0002");
                assertThat(result.getEmail()).isEqualTo("maria.silva@example.com");
                assertThat(clientRepository.findById(result.getId())).contains(result);
            }

            @Test
            @DisplayName("should create a client without email")
            void shouldCreateClientWithoutEmail() {
                Client result = clientService.findOrCreate(new ClientDTO(
                        "Maria da Silva",
                        "+55 73 99999-0002",
                        null
                ));
                clientRepository.flush();

                assertThat(result.getId()).isNotNull();
                assertThat(result.getEmail()).isNull();
            }

            @Test
            @DisplayName("should propagate database conflict when email belongs to another phone")
            void shouldRejectEmailOwnedByAnotherClient() {
                saveClient(aClient().build());

                assertThatThrownBy(() -> {
                    clientService.findOrCreate(new ClientDTO(
                            "Maria da Silva",
                            "+55 73 99999-0002",
                            "joao.santos@example.com"
                    ));
                    clientRepository.flush();
                }).isInstanceOf(DataIntegrityViolationException.class);
            }
        }

        @Nested
        @DisplayName("updateClientData")
        class UpdateClientDataTests {

            @Test
            @DisplayName("should update name and an available phone")
            void shouldUpdateNameAndAvailablePhone() {
                Client client = saveClient(aClient().build());

                clientService.updateClientData(
                        client,
                        "João atualizado",
                        "+55 73 99999-0002"
                );
                clientRepository.flush();

                assertThat(client.getName()).isEqualTo("João atualizado");
                assertThat(client.getPhone()).isEqualTo("+55 73 99999-0002");
            }

            @Test
            @DisplayName("should update only the name when phone is absent")
            void shouldUpdateOnlyNameWhenPhoneIsAbsent() {
                Client client = saveClient(aClient().build());

                clientService.updateClientData(client, "João atualizado", null);

                assertThat(client.getName()).isEqualTo("João atualizado");
                assertThat(client.getPhone()).isEqualTo("+55 73 99999-0001");
            }

            @Test
            @DisplayName("should update only the phone when name is absent")
            void shouldUpdateOnlyPhoneWhenNameIsAbsent() {
                Client client = saveClient(aClient().build());

                clientService.updateClientData(client, null, "+55 73 99999-0002");

                assertThat(client.getName()).isEqualTo("João dos Santos");
                assertThat(client.getPhone()).isEqualTo("+55 73 99999-0002");
            }

            @Test
            @DisplayName("should keep all data when update fields are absent")
            void shouldKeepDataWhenFieldsAreAbsent() {
                Client client = saveClient(aClient().build());

                clientService.updateClientData(client, null, null);

                assertThat(client.getName()).isEqualTo("João dos Santos");
                assertThat(client.getPhone()).isEqualTo("+55 73 99999-0001");
            }

            @Test
            @DisplayName("should accept the phone already owned by the same client")
            void shouldAcceptSamePhone() {
                Client client = saveClient(aClient().build());

                clientService.updateClientData(client, null, client.getPhone());

                assertThat(client.getPhone()).isEqualTo("+55 73 99999-0001");
            }

            @Test
            @DisplayName("should reject a phone owned by another client")
            void shouldRejectPhoneOwnedByAnotherClient() {
                Client client = saveClient(aClient().build());
                Client owner = saveClient(aClient()
                        .withName("Maria da Silva")
                        .withPhone("+55 73 99999-0002")
                        .withEmail("maria.silva@example.com")
                        .build());

                assertThatThrownBy(() ->
                        clientService.updateClientData(client, null, owner.getPhone()))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("Phone number already exists");

                assertThat(client.getPhone()).isEqualTo("+55 73 99999-0001");
            }
        }
    }

    private Client saveClient(Client client) {
        client.setId(null);
        client.setCreatedAt(null);
        return clientRepository.saveAndFlush(client);
    }
}
