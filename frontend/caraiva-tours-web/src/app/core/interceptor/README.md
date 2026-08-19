# Auth interceptor

`authInterceptor` é registrado globalmente por `provideHttpClient` em `app.config.ts`.

Para requisições relativas iniciadas por `/api/`, ele adiciona `Authorization: Bearer <token>`. Chamadas iniciadas por `/auth/` não recebem bearer token, pois representam login, refresh e recuperação de acesso.

Quando uma chamada privada retorna `401`, o interceptor:

1. solicita renovação ao serviço `Auth`;
2. recebe e armazena o novo access token;
3. repete a requisição original com o novo bearer token.

Erros que não sejam `401`, chamadas externas e os próprios endpoints de autenticação são devolvidos ao chamador sem tentativa de refresh. A conexão SSE usa `fetch`, portanto implementa autenticação e refresh no próprio `DashboardEventsService` e não passa por este interceptor.

