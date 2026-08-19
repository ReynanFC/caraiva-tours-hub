# Componentes compartilhados

`shared` reúne infraestrutura e contratos reutilizados por vários domínios. Não deve concentrar regras que pertencem a uma entidade específica.

```text
shared/
├── config/
│   ├── cache/       # Redis Cache e TTLs
│   ├── ratelimit/   # cliente Lettuce do Bucket4j
│   ├── security/    # filtros, RBAC e Argon2
│   ├── swagger/     # contrato OpenAPI
│   └── web/         # CORS
├── dto/             # respostas comuns, como PagedResult
├── exceptions/      # exceções e handler global
└── validation/      # anotações reutilizáveis, como @IsAdmin
```

## Segurança

`SecurityConfig`:

- desabilita HTTP Basic e CSRF;
- usa `SessionCreationPolicy.STATELESS`;
- posiciona `RateLimitFilter` antes de `JwtTokenFilter`;
- libera autenticação, recuperação de senha e OpenAPI;
- exige autenticação em `/api/**`;
- habilita segurança de método para o RBAC.

O `PasswordEncoder` é um `DelegatingPasswordEncoder` configurado com Argon2. Novos hashes recebem identificação do algoritmo, enquanto o encoder padrão de comparação mantém compatibilidade com hashes Argon2 já persistidos.

`@IsAdmin` encapsula a verificação administrativa, evitando repetir expressões de autorização em cada endpoint.

## Cache

`CacheConfig` usa Redis com chaves texto, valores JSON e não guarda resultados nulos.

| Cache | TTL |
| --- | --- |
| `category-options` | 2 minutos |
| `bookings` | 2 minutos |
| `booking-details` | 2 minutos |
| demais regiões | 10 minutos |

Os services controlam quais leituras são cacheáveis e quais escritas invalidam regiões. O PostgreSQL permanece como fonte oficial.

## Redis do rate limit

`shared/config/ratelimit/RedisConfig` cria o cliente Lettuce de baixo nível usado pelo Bucket4j. Spring Cache e templates Redis usados por JWT/password reset são configurados pela autoconfiguração do Spring Data Redis.

## CORS

`CorsConfig` lê uma lista de padrões de origem, permite os métodos HTTP usados pela API, aceita os headers necessários e habilita credenciais. Em produção, a lista deve conter somente os hosts reais do frontend.

## OpenAPI

`OpenApiConfig` registra os esquemas Bearer e cookie de refresh. Um customizador marca automaticamente operações sob `/api/` como protegidas pelo Bearer JWT.

## Erros e paginação

O handler global converte validações e exceções conhecidas em respostas HTTP consistentes. `PagedResult` padroniza conteúdo e metadados de paginação para os domínios, sem expor diretamente a estrutura interna de `Page`.
