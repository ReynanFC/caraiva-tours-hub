# Domínio de clientes

Clientes não possuem controller próprio: são resolvidos e atualizados dentro do fluxo de reserva.

## `ClientService`

`findOrCreate` procura o cliente pelo telefone, usado como identidade operacional. Se não encontrar, cria uma nova entidade. Antes disso, rejeita e-mail já registrado, protegendo a unicidade definida no banco.

`updateClientData` aplica somente nome e telefone presentes no request. Ao trocar o telefone, verifica se ele pertence a outro cliente antes de alterar a entidade gerenciada pela transação da reserva.

`Client.addBooking` sincroniza os dois lados da associação quando usado. O PostgreSQL também possui restrições únicas para telefone e e-mail como última barreira contra concorrência ou inconsistência.
