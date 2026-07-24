# Estado atual do projeto — Caraíva Tours Hub (backend)

> Levantamento realizado em **24 de julho de 2026**, a partir do código, configuração e histórico Git presentes neste repositório. Este documento descreve o backend; não há código de frontend, `docker-compose`, README ou exemplo de variáveis de ambiente na árvore atual.

## Resumo executivo

O projeto é uma API REST para a operação de uma agência de passeios: gestão de usuários, catálogo de categorias e passeios, reservas, clientes, pagamentos de sinal, cancelamentos/reembolsos e indicadores gerenciais.

O backend está em estágio avançado de implementação funcional. A branch atual é `feat/backend/dashboard`, no commit `09daaf4` de 23/07/2026; ela está no mesmo commit que `develop` e `origin/develop`. Há uma branch remota de testes (`origin/feat/backend/unit-tests`) dois commits à frente, ainda não integrada.

## Tecnologias e arquitetura implantadas

| Área | Implementação atual |
| --- | --- |
| Linguagem e plataforma | Java 21 e Spring Boot 4.0.7 |
| API | Spring MVC, REST e Bean Validation |
| Persistência | Spring Data JPA, PostgreSQL e Hibernate com `ddl-auto=validate` |
| Evolução de banco | Flyway; uma migração inicial (`V1__create_initial_schema.sql`) |
| Segurança | Spring Security stateless, JWT, refresh token em cookie HTTP-only e senha com Argon2 |
| Cache | Redis + Spring Cache; TTLs específicos de 2 e 5 minutos |
| Documentação HTTP | Springdoc/OpenAPI e Swagger UI |
| Mapeamento | MapStruct + Lombok |
| Empacotamento | Maven Wrapper e Dockerfile para imagem JRE 21 na porta 8080 |

O código está organizado por domínio. Existem 133 arquivos Java de produção, 10 controllers REST, 11 entidades JPA e um tratamento global de exceções.

## O que já foi entregue

### Base, dados e infraestrutura

- Estrutura inicial criada em 21/06/2026 e depois reorganizada por domínio.
- Modelo PostgreSQL completo para: `users`, `permission`, `user_permission`, `category_tour`, `tour`, `client`, `pickup_location`, `booking`, `group_member`, `payment`, `refund_request` e `status_history`.
- Enums persistidos para perfil de usuário, status de reserva, status de reembolso e tipo de comissão.
- Chaves estrangeiras, índices e restrições de integridade no schema inicial; por exemplo, preço promocional menor que o preço-base e pagamento único por reserva.
- Configuração de CORS para Angular local (`http://localhost:4200`), migrações Flyway, Redis, e-mail SMTP e OpenAPI.
- `PagedResult` padronizado para respostas paginadas e handler global para erros de validação, recurso inexistente, mau pedido e conflitos de negócio.

### Autenticação e usuários

- Login por e-mail e senha: `POST /auth/signin`.
- Renovação de token: `POST /auth/refresh`; o refresh token é enviado em cookie `HttpOnly`, `SameSite=Lax`, com validade de 3 horas.
- JWT para proteger `/api/**`; Swagger e endpoints de autenticação são públicos.
- Perfis `ADMIN` e `EMPLOYEE`, com a anotação `@IsAdmin` para autorização por método.
- CRUD operacional de usuários: criação por administrador, listagem, perfil próprio, perfil de outro usuário por administrador, atualização de perfil, troca da própria senha e ativação/desativação de conta.
- Criação automática da associação usuário–permissão e validação de conta habilitada no refresh token.
- Cache para consultas de usuários já implementado no serviço.

### Catálogo de passeios

- Categorias: listagem paginada, busca, opções para seletores, consulta individual, criação, edição e remoção protegidas para administradores.
- Passeios: listagem/busca paginada, criação, edição, ativação/desativação e remoção por administradores.
- Validações de categoria em uso antes de remoção e de regras de preço/valor promocional.
- Passeios suportam preço-base e promocional, comissão fixa ou percentual, duração, disponibilidade, imagem e categoria.
- Cache aplicado às consultas de categorias e passeios; entradas são invalidadas nas alterações.

### Reservas e operação

- Criação de reserva associando atendente autenticado, passeio, cliente, ponto de embarque, agenda, grupo de viajantes e desconto manual.
- Cliente é localizado/criado pelo telefone e seus dados podem ser atualizados em alterações de reserva.
- Ponto de embarque é criado junto com a reserva.
- Snapshot financeiro na reserva: preço unitário, preço total, desconto, comissão e taxa de embarque ficam preservados para o cálculo operacional.
- Criança no colo é excluída da contagem pagante; os demais membros entram no total de participantes.
- Sinal de 20% é calculado a partir do total da reserva quando há URL de comprovante Pix.
- Listagem, busca, filtro por status, consulta detalhada, atualização e confirmação de reservas.
- Alteração de passeio, membros ou desconto recalcula o snapshot financeiro e o valor esperado do sinal quando existe pagamento.
- Histórico de mudanças de status gravado por evento de aplicação, incluindo criação e confirmação.
- Consulta de membros do grupo por reserva.

### Pagamentos e financeiro

- Criação interna de pagamento de sinal no fluxo de reserva; o modelo armazena valor esperado, comprovante e data de pagamento.
- Visão administrativa de pagamentos recebidos, pendentes de comprovante e saldo remanescente.
- Listagem/filtragem por ID do pagamento, nome do cliente e status da reserva, além de detalhes do pagamento.
- Busca de reservas para o fluxo de pagamento, com filtro opcional de status e texto.
- Mappers, DTOs e projeções específicos para consultas financeiras.

### Cancelamentos e reembolsos

- Funcionário pode abrir solicitação de reembolso para uma reserva; administradores não podem solicitá-la.
- Impede solicitação duplicada pendente e novas solicitações em reservas já canceladas ou em análise.
- Ao abrir a solicitação, a reserva passa para `CANCEL_REQUEST` e a mudança entra no histórico.
- Administrador pode aprovar ou rejeitar solicitação pendente, com observação.
- Aprovação move a reserva para `CANCELLED`; a solicitação registra quem decidiu e quando.
- Listagem administrativa do histórico e listagem das solicitações do próprio usuário.

### Dashboards

- Dashboard individual para o usuário autenticado, com filtros por mês ou histórico completo.
- Dashboard financeiro exclusivo de administrador, também filtrável por mês ou período completo.
- Projeções para receita semanal, receita e demanda por passeio, valores por status, métricas de funcionário e métricas financeiras.
- Cache de dashboards em Redis por 5 minutos.

## Superfície HTTP atual

Todos os caminhos abaixo, exceto autenticação e documentação, exigem JWT. O marcador **admin** significa proteção com `@IsAdmin`.

| Domínio | Endpoints disponíveis |
| --- | --- |
| Autenticação | `POST /auth/signin`, `POST /auth/refresh` |
| Usuários | `GET /api/users` **admin**; `POST /api/users` **admin**; `GET /api/users/me/profile`; `GET /api/users/me/header`; `PUT /api/users/me`; `GET /api/users/{id}/profile` **admin**; `PUT /api/users/{uuid}/password`; `PATCH /api/users/{id}/toggle-status` **admin** |
| Categorias | `GET /api/categories`; `GET /api/categories/options`; `GET /api/categories/{id}`; `POST`, `PUT /{id}` e `DELETE /{id}` em `/api/categories` **admin** |
| Passeios | `GET /api/tours`; `POST /api/tours` **admin**; `PUT`, `PATCH` e `DELETE /api/tours/{id}` **admin** |
| Reservas | `GET /api/bookings`; `GET /api/bookings/status/{status}`; `GET /api/bookings/{id}`; `POST /api/bookings`; `PATCH /api/bookings/{id}`; `PATCH /api/bookings/{id}/confirm`; `GET /api/bookings/{bookingId}/group-members` |
| Pagamentos | `GET /api/payments`, `/overview`, `/reservations`, `/{id}` e `/status/{status}` — todos **admin** |
| Reembolsos | `GET /api/refund-requests` **admin**; `GET /api/refund-requests/mine`; `POST /api/refund-requests`; `PATCH /api/refund-requests/{id}/resolution` **admin** |
| Dashboard | `GET /api/dashboard`; `GET /api/dashboard/finance` **admin** |

As interfaces `*ControllerDocs` descrevem os endpoints no Swagger. Não há controller público ativo para clientes, pontos de embarque ou histórico de status: esses dados são hoje manipulados/consultados indiretamente pelo fluxo de reservas.

## Regras de negócio atualmente codificadas

1. Uma reserva sem comprovante Pix nasce como `DRAFT`; com comprovante, nasce como `CONFIRMED` e recebe um pagamento de sinal de 20%.
2. Reservas podem ser confirmadas por `PATCH /api/bookings/{id}/confirm`.
3. Reservas em estado não permitido não podem ser editadas; a regra está encapsulada na entidade `Booking`.
4. Não há endpoint que altere uma reserva para `COMPLETED` nem endpoint para registrar/aprovar um comprovante após a criação.
5. Rejeitar um reembolso mantém a reserva em `CANCEL_REQUEST`; somente a aprovação a move para `CANCELLED`.
6. O schema e o enum contêm os estados `DRAFT`, `COMPLETED`, `CONFIRMED`, `CANCELLED` e `CANCEL_REQUEST`. Os comentários do enum divergem parcialmente dos nomes usados em alguns métodos e merecem alinhamento de regra antes de evoluções nesse fluxo.

## Cache existente

| Cache | TTL |
| --- | --- |
| `category-options`, `bookings`, `booking-details` | 2 minutos |
| `dashboard-user`, `dashboard-finance` | 5 minutos |
| Demais caches, como pagamentos e usuários | 10 minutos (padrão) |

As operações de escrita dos domínios principais invalidam os caches relacionados. Listagens de reservas com texto de busca não são cacheadas; apenas as consultas sem filtro atendem à condição de cache.

## Linha do tempo das entregas

| Data | Entregas principais |
| --- | --- |
| 21–23/06/2026 | Estrutura inicial, entidades e relacionamentos, schema Flyway, DTOs, reorganização por domínio, segurança JWT, CORS, OpenAPI, Redis e autenticação. |
| 25–27/06/2026 | Serviço/controlador de autenticação, refresh token em Redis/cookie, configuração de e-mail. |
| 01–02/07/2026 | Serviços, controllers, documentação e cache para categorias e passeios; `@IsAdmin`; paginação padronizada. |
| 03–06/07/2026 | Serviço/controller de usuários, permissões automáticas, validação de conta habilitada e refatorações do core/schema. |
| 07–22/07/2026 | DTOs e integração de reservas, clientes, grupo, histórico de status, pagamentos, cache e endpoint de membros. |
| 23/07/2026 | Fluxo de reembolsos, consultas de pagamentos, dashboards financeiro/individual, projeções e cache de dashboards. |
| 23/07/2026 (não integrado) | Testes de serviços e repositórios de reservas/pagamentos, com Testcontainers PostgreSQL, na branch `origin/feat/backend/unit-tests`. |

## Qualidade e validação verificada

- `./mvnw test` foi executado em 24/07/2026.
- A compilação de produção e de teste foi concluída: 133 classes principais e 1 classe de teste foram compiladas.
- O único teste presente no `HEAD`, `CaraivaToursHubApplicationTests.contextLoads`, falhou ao iniciar o contexto: a variável `DB_URL` não foi resolvida (`jdbcUrl, ${DB_URL}`). Portanto, a suíte atual não passa neste ambiente sem configuração de banco.
- O `pom.xml` emite aviso: a dependência Lombok usa o escopo `annotationProcessor`, que não é um escopo Maven válido. A compilação atual ainda funciona, mas é um ajuste necessário para compatibilidade futura.
- No `HEAD` há somente o teste de carregamento de contexto. A branch de testes não integrada acrescenta testes de serviço e de repositório para reservas e pagamentos, além de Testcontainers PostgreSQL.

## Pendências e pontos de atenção

1. Integrar e executar a branch `feat/backend/unit-tests`; ela contém a cobertura de teste mais relevante já produzida.
2. Definir e implementar o ciclo completo de pagamento/comprovante e o significado definitivo de `DRAFT`, `COMPLETED` e `CONFIRMED`.
3. Definir o comportamento após rejeição de reembolso — atualmente a reserva continua em `CANCEL_REQUEST`.
4. Avaliar se clientes, pontos de embarque e histórico de status precisam de endpoints próprios; hoje não existem controllers para esses domínios.
5. Adicionar README, instruções de execução, `.env.example`, `docker-compose` para PostgreSQL/Redis e documentação de deployment. O Dockerfile pressupõe que o JAR já tenha sido gerado em `target/`.
6. Corrigir o escopo Maven do Lombok e revisar a configuração de e-mail, que está aninhada em `spring.spring.mail` no `application.yaml` em vez de `spring.mail`.
7. Revisar a política de CORS e `app.security.cookie.secure` antes de produção; o perfil `dev` aceita somente Angular local e define cookie seguro como `false`.

## Estado do workspace no momento do levantamento

- Branch ativa: `feat/backend/dashboard`.
- `HEAD`: `09daaf4` — `feat(dashboard): cache dashboard metrics for five minutes`.
- Havia uma alteração local não commitada em `DashboardService.java`, limitada à formatação de `resolvePeriod` e `percentage`. Ela foi preservada e não faz parte desta documentação.
