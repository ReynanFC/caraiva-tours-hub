# Modelagem de dados — Caraíva Tours Hub

Este documento registra a evolução da modelagem do sistema e compara os artefatos visuais com a implementação vigente em **20 de agosto de 2026**.

## Artefatos e fonte de verdade

| Nível | Artefato | Finalidade |
|---|---|---|
| Conceitual | [tour_conceitual.png](tour_conceitual.png) | Visão de negócio original: entidades, atributos e relacionamentos. |
| Lógico | [DB_logico.png](DB_logico.png) | Tradução inicial para tabelas, tipos, chaves e cardinalidades. |
| Orientado a objetos | [Project_Tour_uml.png](Project_Tour_uml.png) | Estrutura original das entidades Java, associações, enums e operações de domínio. |
| Físico vigente | [`V1__create_initial_schema.sql`](../backend/caraiva-tours-hub/src/main/resources/db/migration/V1__create_initial_schema.sql) | Estrutura efetivamente criada no PostgreSQL. É a referência principal deste documento. |
| Dados iniciais | [`V2__seed_permissions.sql`](../backend/caraiva-tours-hub/src/main/resources/db/migration/V2__seed_permissions.sql) | Criação idempotente das permissões `ADMIN` e `EMPLOYEE`. |

Os diagramas são registros históricos e não devem ser usados isoladamente para gerar ou alterar o banco. Em caso de divergência, prevalecem as migrations versionadas; as entidades JPA devem permanecer compatíveis com elas.

## Visão geral do modelo atual

O núcleo do domínio é `booking`. Cada reserva aponta obrigatoriamente para um passeio, um cliente, o usuário atendente e um local de embarque. Ela preserva valores financeiros no momento da venda, pode possuir um pagamento, contém os participantes do grupo e acumula registros de mudança de status. Solicitações de reembolso são associadas à reserva e aos usuários responsáveis por solicitar e, eventualmente, resolver o pedido.

### Entidades e responsabilidades

| Tabela | Responsabilidade no modelo físico atual |
|---|---|
| `category_tour` | Classifica passeios e mantém nome único. |
| `tour` | Catálogo do passeio, preços normal e promocional, comissão, duração, disponibilidade e categoria. |
| `pickup_location` | Local de embarque e taxa vigente daquele local. |
| `client` | Passageiro/contratante, identificado também por telefone único e e-mail opcional único. |
| `users` | Usuário interno que vende, altera status e trata reembolsos. Possui UUID público além da chave numérica. |
| `permission` | Papel de autorização (`ADMIN` ou `EMPLOYEE`). |
| `user_permission` | Associação N:N entre usuários e permissões. |
| `booking` | Agregado da reserva e seus snapshots financeiros e operacionais. |
| `group_member` | Participantes adicionais, incluindo identificação de criança de colo. |
| `payment` | Comprovante e valor esperado de um pagamento. |
| `status_history` | Auditoria das transições de status, autor e motivo. |
| `refund_request` | Solicitação de reembolso, situação, observação administrativa e responsáveis. |

### Relacionamentos e cardinalidades físicas

| Origem | Destino | Cardinalidade e regra |
|---|---|---|
| `category_tour` | `tour` | 1:N; todo passeio tem uma categoria. Exclusão da categoria é restringida enquanto houver passeios. |
| `tour` | `booking` | 1:N; toda reserva tem um passeio. Exclusão restringida. |
| `client` | `booking` | 1:N; toda reserva tem um cliente. Exclusão restringida. |
| `users` | `booking` | 1:N; toda reserva registra o atendente. Exclusão restringida. |
| `pickup_location` | `booking` | 1:N; toda reserva tem um local de embarque. Exclusão restringida. |
| `booking` | `payment` | 0..1:1 no lado da reserva, garantido pelo índice único de `booking.payment_id`; ao excluir o pagamento, a referência vira `NULL`. |
| `booking` | `group_member` | 1:N; membros são removidos em cascata com a reserva. |
| `booking` | `status_history` | 1:N; históricos são removidos em cascata com a reserva. |
| `users` | `status_history` | 1:N; cada mudança possui um autor obrigatório. |
| `booking` | `refund_request` | 1:N; o esquema permite mais de uma solicitação para a mesma reserva. |
| `users` | `refund_request` | 1:N em dois papéis: solicitante obrigatório e resolvedor opcional. |
| `users` | `permission` | N:N por `user_permission`, com chave primária composta e exclusão em cascata da associação. |

## Modelo conceitual

O [modelo conceitual](tour_conceitual.png) reconhece corretamente os principais conceitos do negócio: categoria, passeio, reserva, cliente, embarque, usuário, permissões, participantes, pagamento, histórico e reembolso. A centralidade de `Booking` e as relações de categoria/passeio, cliente/reserva e usuário/venda permanecem válidas.

### Evolução em relação ao conceito original

| No diagrama conceitual | No modelo físico vigente |
|---|---|
| A reserva contém `tour_date`, `custom_pickup_time`, `applied_pickup_fee`, `observation` e `total_price_snapshot`. | A data e o horário foram consolidados em `custom_schedule`. `observation` deixou de existir. A taxa passou a pertencer ao local em `pickup_location.applied_pickup_fee`. |
| Há somente preços unitário e total na reserva. | A reserva também guarda `commission_snapshot`, `manual_discount`, `created_at` e `updated_at`. |
| O passeio traz os atributos funcionais principais. | Foram preservados, com categoria obrigatória e validações de preço. `image_url`, antes indicado como opcional/derivado, é uma coluna física opcional. |
| O pagamento contém `amount_paid` e `external_receipt_url`. | Os nomes atuais são `expected_amount` e `receipt_url`; ambos são obrigatórios. |
| O histórico registra apenas status anterior, novo status e data. | Foi acrescentado `change_reason`, e cada evento referencia obrigatoriamente a reserva e o usuário autor. |
| O reembolso tem motivo, status, solicitação e resolução. | Foi acrescentada `admin_observation`; há usuário solicitante obrigatório e usuário resolvedor opcional. Uma reserva pode acumular várias solicitações. |
| `User` possui `credentials_non_expired`. | A coluna continua no banco, mas não está declarada explicitamente na entidade Java atual. |
| A relação de embarque aparece como `reside`, com leitura ambígua. | O vínculo concreto é direto: muitas reservas podem usar um local de embarque; não há relação entre cliente e local. |

O modelo conceitual deve, portanto, ser entendido como uma primeira definição do domínio, não como descrição fiel das regras atuais.

## Modelo lógico

O [modelo lógico](DB_logico.png) aproxima-se mais da implementação: introduz chaves estrangeiras, tipos PostgreSQL e a tabela associativa `user_permission`. Ainda assim, ele antecede mudanças relevantes.

### Diferenças para o esquema atual

| Área | Modelo lógico da imagem | Modelo físico atual |
|---|---|---|
| Reserva | Não apresenta `commission_snapshot` nem `updated_at`. | Ambas as colunas são obrigatórias; a comissão possui padrão `0.00`. |
| Pagamento | `amount_paid`, `external_receipt_url` e FK para reserva dentro de `payment`. | `expected_amount`, `receipt_url`; a FK opcional fica em `booking.payment_id` e possui índice único. |
| Reembolso | Uma FK de reserva e uma FK genérica de usuário. | `booking_id`, `requested_by_user_id` obrigatório e `resolved_by_user_id` opcional, além de `admin_observation`. |
| Histórico | A imagem sugere FK de histórico em `users` e também FK de reserva no histórico. | Não há FK de histórico em `users`; cada linha de `status_history` aponta para `booking` e `users`. |
| Passeio | Estrutura principal compatível. | Há `CHECK`s: preço-base positivo, promocional não negativo e menor que o base, comissão positiva. |
| Reserva | Estrutura principal compatível. | Há `CHECK`s para preços positivos, comissão e desconto não negativos e desconto limitado ao total. |
| Cardinalidade de reembolso | Visualmente próxima de 0..1 por reserva. | A ausência de restrição `UNIQUE` em `refund_request.booking_id` torna a relação 1:N. |
| Exclusões | Não explicita todas as ações referenciais. | Usa `RESTRICT` nos cadastros referenciados, `CASCADE` nos dependentes e `SET NULL` para pagamento. |
| Busca e desempenho | Não representa índices de busca. | Usa `pg_trgm`, índices GIN/trigram, busca textual em português e índices nas FKs e status. |

## Modelo UML das entidades

O [UML original](Project_Tour_uml.png) continua útil para compreender o agregado `Booking`, mas não reflete integralmente as classes atuais.

### Elementos preservados

- `Booking` continua agregando passeio, cliente, atendente, local, participantes, pagamento e histórico.
- `CategoryTour` mantém a coleção de passeios.
- `Client` mantém a coleção de reservas.
- `Tour` conserva `CommissionType` (`PERCENTAGE`, `FIXED`) e a operação de cálculo de comissão, hoje denominada `calculateCommissionPerPerson`.
- `Booking` ainda calcula preço total, depósito e gerencia participantes; atualmente também atualiza o snapshot financeiro e valida transições permitidas.
- `UserRole` e `RefundStatus` permanecem com os mesmos valores.

### Mudanças desde o UML

| Classe/enum | UML da imagem | Implementação atual |
|---|---|---|
| `BookingStatus` | `PENDING_RECEIPT`, `CONFIRMED`, `COMPLETED`, `CANCELLED`. | `DRAFT`, `COMPLETED`, `CONFIRMED`, `CANCELLED`, `CANCEL_REQUEST`. |
| `Booking` | Campos financeiros individuais; sem data de atualização. | Usa o objeto embutido imutável `FinancialSnapshot` para preço unitário, total, comissão e desconto; possui `updatedAt`. Coleções são listas ordenadas. |
| `FinancialSnapshot` | Não existe no UML. | Novo `@Embeddable` que representa a fotografia financeira da venda e evita depender dos preços futuros do passeio. |
| `Payment` | `amountPaid` e `externalReceiptUrl`. | `expectedAmount` e `receiptUrl`; associação 1:1 com `Booking`. |
| `StatusHistory` | Sem motivo da alteração. | Inclui `changeReason` obrigatório. |
| `RefundRequest` | Um único campo `user`. | Distingue `requestedByUser` e `resolvedByUser`, e inclui `adminObservation`. |
| `User` | Declara `credentialsNonExpired` e associações de reservas/histórico. | Não declara o campo `credentialsNonExpired`; mantém permissões, reservas e histórico. Implementa `UserDetails`. |
| `Permission` | Associação simples com `User`. | Implementa `GrantedAuthority`; a relação N:N é materializada por `user_permission`. |
| Operações de `Booking` | `calculateTotalPrice`, `calculateRequiredDeposit`, `getRemainingBalance`, `addGroupMember`. | `getRemainingBalance` não está na entidade; entraram `updateFinancials`, cálculo de participantes e validações de modificação/cancelamento. |

## Modelo físico vigente

### Tipos enumerados

| Tipo PostgreSQL | Valores |
|---|---|
| `user_role_enum` | `ADMIN`, `EMPLOYEE` |
| `booking_status_enum` | `DRAFT`, `COMPLETED`, `CONFIRMED`, `CANCELLED`, `CANCEL_REQUEST` |
| `refund_status_enum` | `PENDING`, `APPROVED`, `REJECTED` |
| `commission_type_enum` | `PERCENTAGE`, `FIXED` |

A migration V2 insere as permissões correspondentes aos dois papéis por meio de `ON CONFLICT (role) DO NOTHING`. O índice único `uk_permission_role`, criado na mesma migration, torna essa carga repetível sem duplicação.

### Integridade e decisões importantes

- Todas as chaves primárias numéricas são `BIGINT GENERATED ALWAYS AS IDENTITY`.
- `users.external_user_id` é um UUID único gerado no banco e serve como identificador externo sem expor a chave sequencial.
- Telefone de cliente, e-mails de cliente/usuário, nome de categoria e nome de passeio possuem unicidade.
- Os snapshots da reserva preservam preço e comissão contratados mesmo se o catálogo for alterado depois. A taxa de embarque, contudo, é consultada atualmente a partir de `pickup_location`, não gravada como snapshot na reserva; portanto, uma alteração posterior da taxa pode afetar o cálculo de uma reserva existente.
- A tabela de histórico registra transições, mas o banco não valida se `previous_status` corresponde ao estado anterior nem se a transição é permitida; essa regra é da aplicação.
- O esquema permite várias solicitações de reembolso por reserva e não impede mais de uma solicitação pendente. Se a regra de negócio exigir apenas uma, será necessária validação na aplicação ou índice parcial.

## Pontos de atenção entre banco e entidades JPA

Estas não são apenas diferenças históricas dos diagramas; são desalinhamentos atuais que devem ser observados em manutenção futura:

1. `tour.description` aceita `NULL` em V1, enquanto `Tour.description` usa `nullable = false`.
2. `users.full_name` é `NOT NULL` em V1, mas `User.fullName` não declara `nullable = false`.
3. `users.credentials_non_expired` existe como coluna obrigatória com padrão `TRUE`, porém não possui campo explícito na entidade `User`.
4. Os comentários de `BookingStatus` no código parecem trocar a semântica de alguns nomes (`COMPLETED` é comentado como comprovante aprovado, `CONFIRMED` como passeio finalizado, e `CANCELLED`/`CANCEL_REQUEST` também aparentam inversão). O enum persistido e as regras de serviço devem ser considerados antes de corrigir apenas os comentários.
5. `RefundRequest` declara `@Table(name = "RefundRequest")`, enquanto a migration cria `refund_request`. A estratégia física de nomes do Spring/Hibernate normalmente converte o nome, mas explicitar `refund_request` reduziria dependência de configuração.

## Manutenção desta documentação

Ao alterar o domínio:

1. crie uma nova migration Flyway; não edite migrations já aplicadas em ambientes compartilhados;
2. atualize as entidades JPA e testes;
3. atualize este documento e, quando possível, regenere os diagramas;
4. trate V1/V2 como o início histórico do esquema e a sequência completa de migrations como a fonte de verdade futura.
