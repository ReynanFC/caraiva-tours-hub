# TokenStore

`TokenStore` mantém o access token em um Signal privado e expõe apenas operações controladas para leitura, atualização e limpeza.

O token existe somente em memória:

- `setAccessToken()` é chamado após login ou refresh;
- `getAccessToken()` atende interceptor, sessão e conexão SSE;
- `isAuthenticated` permite decisões reativas de navegação;
- `clearToken()` encerra a autenticação local.

Não grave o access token em `localStorage` ou `sessionStorage`. Após um reload, `session-init.ts` solicita um novo token usando o refresh cookie do backend.

