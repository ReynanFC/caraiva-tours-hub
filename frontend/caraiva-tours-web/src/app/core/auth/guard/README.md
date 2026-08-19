# Guards e inicialização da sessão

## `session-init.ts`

Registrado por `provideAppInitializer` em `app.config.ts`, executa antes da navegação inicial. Ele chama `POST /auth/refresh` com cookies, limita a espera a cinco segundos e, quando recebe sucesso, grava o novo access token no `TokenStore`.

Falhas e timeout são tratados como ausência de sessão. Isso permite que a aplicação continue carregando e encaminhe o usuário à tela de login, em vez de bloquear o bootstrap.

## `auth-guard.ts`

Protege o grupo de rotas renderizado dentro do `MainLayout`. O guard consulta `TokenStore.isAuthenticated()`:

- com token, permite a navegação;
- sem token, retorna uma `UrlTree` para `/login`.

O guard protege a navegação no cliente, mas não substitui autorização no backend. Toda API privada ainda deve validar token e papel do usuário.

