# SessionStore

`SessionStore` representa a identidade do usuário autenticado para o restante da interface.

## Dados expostos

- `profileResource`: carrega o resumo do usuário em `/api/users/me/header`;
- `userProfile`: perfil atual ou `null`;
- `isLoading`: estado de carregamento do perfil;
- `isAdmin` e `isEmployee`: Signals derivados do papel;
- `userId`: identificador lido de forma segura das claims do JWT.

O papel é obtido primeiro das claims do access token e pode ser confirmado pelo perfil retornado pela API. A requisição do perfil em andamento é compartilhada para evitar chamadas duplicadas durante o mesmo carregamento.

`hasPermissionAdmin()` e `hasPermissionEmployee()` são verificações rápidas usadas por serviços e telas antes de operações restritas. A autorização definitiva continua sendo responsabilidade do backend.

Ao sair, `clear()` força a reavaliação do recurso de perfil depois que o token é apagado.

