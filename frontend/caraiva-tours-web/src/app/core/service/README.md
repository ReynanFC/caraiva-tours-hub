# Serviços globais

## `Auth`

O serviço `Auth` coordena a renovação do access token em `POST /auth/refresh`.

Ele impede refreshes paralelos por meio de `isRefreshing` e de um `BehaviorSubject`: a primeira requisição inicia a renovação e as demais aguardam o token resultante. Em caso de sucesso, o `TokenStore` é atualizado. Em caso de falha, o token local é removido e o erro segue para o chamador.

Este serviço é usado pelo interceptor HTTP e pelo stream SSE do dashboard. Login e recuperação de senha continuam no serviço da feature `login`, pois são responsabilidades daquele domínio.

