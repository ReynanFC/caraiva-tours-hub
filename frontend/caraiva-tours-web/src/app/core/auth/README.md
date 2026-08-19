# Autenticação

Esta pasta separa três responsabilidades: decidir se uma rota pode abrir, representar a sessão atual e armazenar o access token.

- [`guard`](guard/README.md): inicialização e proteção de navegação;
- [`session`](session/README.md): perfil, identificador, papel e permissões;
- [`token`](token/README.md): token de acesso em memória.

O access token não é persistido no navegador. A continuidade da sessão após recarregar a página vem da chamada de refresh feita durante o bootstrap e do cookie seguro controlado pelo backend.

