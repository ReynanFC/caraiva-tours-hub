# Layout autenticado

`MainLayout` é a moldura das rotas privadas. Ele reúne cabeçalho, menu lateral, conteúdo via `RouterOutlet`, perfil do usuário e comportamento responsivo.

## Responsabilidades

- carregar o perfil exposto pelo `SessionStore`;
- filtrar itens de navegação conforme o papel do usuário;
- atualizar título e descrição ao trocar de rota;
- alternar a sidebar conforme o breakpoint móvel;
- abrir o diálogo do perfil atual;
- limpar token e sessão durante o logout.

`main-layout/components` contém o header e a sidebar. `models` contém os contratos usados exclusivamente pelo layout, enquanto `service/layout.ts` encapsula a leitura de `/api/users/me/header`.

Novas rotas privadas devem ser adicionadas como filhas do `MainLayout` em `app.routes.ts`. Se também precisarem aparecer no menu, inclua o respectivo `NavigationItem` e defina claramente a regra de visibilidade por papel.

