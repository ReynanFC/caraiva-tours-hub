# Domínio de autenticação

O domínio `auth` é a porta de entrada da identidade da aplicação. Ele autentica credenciais, emite tokens, renova sessões e inicia a definição ou recuperação de senha.

```text
auth/
├── controller/       # endpoints públicos e cookie de refresh
├── dto/              # credenciais, tokens e principal autenticado
├── entity/           # Permission e UserRole
├── jwt/              # access token, refresh e filtro de segurança
├── passwordreset/    # tokens de definição/redefinição de senha
└── AuthService.java
```

## `AuthService`

- `signIn`: entrega e-mail e senha ao `AuthenticationManager`; após autenticação, seleciona o papel persistido do usuário e solicita o par de tokens. Se não houver permissão associada, utiliza `EMPLOYEE`, o papel de menor privilégio.
- `refreshToken`: delega toda validação e rotação ao `JwtTokenProvider`; o controller substitui o cookie de refresh e não devolve esse token no corpo.

`AuthService` não compara hashes diretamente nem manipula o Redis. Essas responsabilidades ficam, respectivamente, no Spring Security/UserService e na subpasta `jwt`.

## Fluxo HTTP

| Endpoint | Responsabilidade |
| --- | --- |
| `POST /auth/signin` | autentica e retorna access token; refresh segue em cookie HttpOnly |
| `POST /auth/refresh` | consome o cookie atual e rotaciona o par de tokens |
| `POST /auth/forgot-password` | inicia recuperação sem revelar se o e-mail existe |
| `POST /auth/reset-password` | consome token descartável e grava nova senha |

Documentação aprofundada:

- [`jwt/README.md`](jwt/README.md): claims, filtro, Redis, rotação e revogação;
- [`passwordreset/README.md`](passwordreset/README.md): primeiro acesso, geração, hash, TTL e consumo do token.
