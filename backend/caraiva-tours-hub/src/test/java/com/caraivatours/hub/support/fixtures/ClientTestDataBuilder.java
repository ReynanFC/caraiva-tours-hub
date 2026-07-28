package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.client.Client;

import java.time.LocalDateTime;

public final class ClientTestDataBuilder {

    private Long id;
    private String name = "João dos Santos";
    private String phone = "+55 73 99999-0001";
    private String email = "joao.santos@example.com";
    private LocalDateTime createdAt = LocalDateTime.of(2026, 1, 10, 10, 0);

    private ClientTestDataBuilder() {
    }

    public static ClientTestDataBuilder aClient() {
        return new ClientTestDataBuilder();
    }

    public ClientTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public ClientTestDataBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public ClientTestDataBuilder withPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public ClientTestDataBuilder withEmail(String email) {
        this.email = email;
        return this;
    }

    public ClientTestDataBuilder withCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public Client build() {
        Client client = new Client(name, phone, email);
        client.setId(id);
        client.setCreatedAt(createdAt);
        return client;
    }
}
