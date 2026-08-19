# Domínio de usuários

O domínio representa funcionários e administradores e também implementa `UserDetailsService` para o Spring Security.

## Entidade `User`

- `permission` fornece as `GrantedAuthority` usadas no RBAC;
- `addPermission` evita valor nulo e duplicidade;
- `isEnabled` controla autenticação/renovação da conta;
- `externalUserId` é o identificador público incluído no JWT, enquanto o ID numérico é usado internamente.

## `UserService`

- `loadUserByUsername`: carrega por e-mail durante a autenticação;
- `findAll`, `findHeaderDataById` e `findProfile`: entregam visões paginada, cabeçalho e perfil com caches separados;
- `createUser`: exige e-mail único, cria conta ativa, associa a role persistida e inicia definição de senha;
- `updateUser`: aplica campos editáveis e invalida lista/perfil;
- `changePassword`: compara a senha atual antes de codificar a nova;
- `changeEnabled`: ativa ou desativa a conta.

## Primeiro acesso seguro

O administrador não escolhe uma senha padrão. O service gera 32 bytes aleatórios, codifica essa credencial com Argon2 e a persiste. Em seguida envia um token de configuração com validade de 15 minutos. Como ninguém conhece a credencial inicial, o usuário só acessa a conta depois de definir a própria senha.

Os papéis vêm da tabela de permissões e são associados durante a criação. Operações administrativas são protegidas por `@IsAdmin` nos controllers/métodos correspondentes.
