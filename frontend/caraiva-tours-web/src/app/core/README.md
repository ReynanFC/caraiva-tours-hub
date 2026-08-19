# Core

`core` contém a infraestrutura global do frontend. Seus serviços são compartilhados entre as features e representam conceitos que devem ter uma única instância durante a execução da aplicação.

## Estrutura

```text
core/
├── auth/
│   ├── guard/    # restauração inicial e proteção de rotas
│   ├── session/  # perfil, papel e permissões do usuário
│   └── token/    # access token mantido em memória
├── http/         # contratos e tradução de erros da API
├── interceptor/  # bearer token e recuperação após 401
├── layout/       # estrutura visual das rotas autenticadas
└── service/      # serviço global de renovação da autenticação
```

## Fluxo de autenticação

```text
bootstrap
  → initSession chama /auth/refresh
  → TokenStore recebe o access token
  → authGuard autoriza as rotas privadas
  → authInterceptor adiciona Authorization às chamadas
  → SessionStore carrega o perfil e expõe papel/permissões
```

Se uma chamada autenticada responder `401`, o interceptor solicita um novo token ao serviço `Auth` e repete a requisição uma vez. Requisições simultâneas aguardam a mesma renovação.

## Regras de dependência

- `core` pode depender do Angular e de código em `shared` quando necessário para a infraestrutura visual.
- `core` não deve importar páginas ou regras pertencentes a uma feature.
- Features podem consumir stores, helpers e serviços de `core`.
- Um serviço só deve entrar em `core` quando for transversal à aplicação; serviços de um domínio permanecem na feature.

Mais detalhes estão nos READMEs de [`auth`](auth/README.md), [`http`](http/README.md), [`interceptor`](interceptor/README.md), [`layout`](layout/README.md) e [`service`](service/README.md).

