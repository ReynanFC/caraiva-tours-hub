# Caraíva Tours Web

Frontend do sistema interno da Porto Caraíva para gerenciamento da operação de passeios. A aplicação reúne autenticação, dashboard operacional e financeiro, reservas, passeios, pagamentos, usuários e solicitações de reembolso em uma interface responsiva para administradores e funcionários.

## Tecnologias

- Angular 22 com componentes standalone e carregamento lazy de rotas;
- TypeScript 6;
- Angular Signals e `resource` para estado reativo e requisições;
- RxJS para fluxos assíncronos e integração HTTP;
- PrimeNG 22 e tema Aura para componentes de interface;
- Tailwind CSS 4 para estilos utilitários;
- Chart.js para os gráficos do dashboard;
- Server-Sent Events (SSE) para atualização do dashboard em tempo real;
- Vitest e Angular TestBed para testes unitários.

A aplicação usa detecção de mudanças zoneless. Portanto, estados visuais devem ser representados preferencialmente por Signals, `computed`, `resource` ou observables integrados corretamente ao Angular.

## Pré-requisitos

- Node.js em uma versão LTS compatível com Angular 22;
- npm 10 ou superior;
- backend do Caraíva Tours Hub disponível em `http://localhost:8080` durante o desenvolvimento.

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Acesse `http://localhost:4200`. O servidor de desenvolvimento observa alterações nos arquivos e utiliza [`src/proxy.conf.json`](src/proxy.conf.json) para encaminhar `/api` e `/auth` ao backend local na porta `8080`.

Não é necessário configurar uma URL de API no frontend para o ambiente local: os serviços utilizam caminhos relativos, como `/api/bookings` e `/auth/signin`.

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm start` | Executa a aplicação em modo de desenvolvimento. |
| `npm run build` | Gera o build de produção em `dist/`. |
| `npm run watch` | Mantém um build de desenvolvimento em observação. |
| `npm test` | Executa os testes unitários com Vitest. |

## Arquitetura

O projeto é organizado por responsabilidade global e por domínio de negócio:

```text
src/
├── app/
│   ├── core/                              # infraestrutura global da aplicação
│   │   ├── auth/
│   │   │   ├── guard/                     # inicialização da sessão e proteção de rotas
│   │   │   ├── session/                   # perfil, papel e permissões do usuário
│   │   │   └── token/                     # access token mantido em memória
│   │   ├── http/                          # contratos e tradução de erros da API
│   │   ├── interceptor/                   # autenticação HTTP e renovação após 401
│   │   ├── layout/
│   │   │   ├── main-layout/
│   │   │   │   └── components/
│   │   │   │       ├── layout-header/     # cabeçalho das páginas privadas
│   │   │   │       └── layout-sidebar/    # navegação lateral responsiva
│   │   │   ├── models/                    # modelos exclusivos do layout
│   │   │   └── service/                   # consulta do perfil exibido no layout
│   │   └── service/                       # serviços globais, como refresh de token
│   ├── features/                          # funcionalidades separadas por domínio
│   │   ├── booking/
│   │   │   ├── components/
│   │   │   │   ├── booking-cancel-dialog/
│   │   │   │   ├── booking-details-dialog/
│   │   │   │   ├── booking-edit-dialog/
│   │   │   │   ├── booking-list-filters/
│   │   │   │   ├── booking-list-table/
│   │   │   │   └── booking-status-badge/
│   │   │   ├── models/
│   │   │   ├── pages/
│   │   │   │   ├── booking-create/
│   │   │   │   └── booking-list/
│   │   │   └── services/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── confirmation-status/
│   │   │   │   ├── employee-sales-ranking/
│   │   │   │   ├── latest-bookings/
│   │   │   │   ├── metric-card/
│   │   │   │   ├── most-requested-tours-chart/
│   │   │   │   └── weekly-revenue-chart/
│   │   │   ├── models/
│   │   │   ├── pages/dashboard-page/
│   │   │   └── services/                 # consultas HTTP e conexão SSE
│   │   ├── login/
│   │   │   ├── models/
│   │   │   ├── page/
│   │   │   │   └── password-recovery/
│   │   │   └── services/
│   │   ├── payment/
│   │   │   ├── components/
│   │   │   │   ├── payment-details-dialog/
│   │   │   │   ├── payment-filters/
│   │   │   │   ├── payment-list/
│   │   │   │   └── payment-overview/
│   │   │   ├── models/
│   │   │   ├── pages/payment-page/
│   │   │   └── services/
│   │   ├── refundrequest/
│   │   │   ├── components/
│   │   │   │   ├── refund-form/
│   │   │   │   ├── refund-list/
│   │   │   │   └── status-badge/
│   │   │   ├── models/
│   │   │   ├── pages/refund-page/
│   │   │   └── services/
│   │   ├── tours/
│   │   │   ├── components/
│   │   │   │   ├── category-dialog/
│   │   │   │   ├── tour-card-grid/
│   │   │   │   └── tours-list-filters/
│   │   │   ├── model/
│   │   │   ├── page/tours-list/
│   │   │   ├── pipe/
│   │   │   └── service/
│   │   └── user/
│   │       ├── components/
│   │       │   ├── user-card/
│   │       │   ├── user-create-dialog/
│   │       │   ├── user-list-filter/
│   │       │   └── user-pagination/
│   │       ├── models/
│   │       ├── pages/users-list/
│   │       └── services/
│   ├── shared/                            # recursos reutilizados entre domínios
│   │   ├── components/
│   │   │   ├── action-notification/
│   │   │   ├── card/
│   │   │   ├── image-upload/
│   │   │   ├── input/
│   │   │   ├── payment-details-dialog/
│   │   │   └── user-profile-dialog/
│   │   ├── models/                        # contratos compartilhados
│   │   ├── pipes/                         # transformações de apresentação
│   │   ├── services/                      # integrações compartilhadas
│   │   └── utils/                         # funções puras de data, moeda e senha
│   ├── app.config.ts                      # providers globais da aplicação
│   └── app.routes.ts                      # rotas públicas e privadas
├── assets/                                # recursos e traduções da API
├── main.ts                                # bootstrap standalone
├── proxy.conf.json                        # proxy local para o backend
└── styles.css                             # estilos globais e tokens visuais
```

### `core`

Contém serviços e componentes que existem uma única vez e sustentam toda a aplicação: autenticação, sessão, token, interceptor HTTP, normalização de erros e layout autenticado. Uma feature pode depender de `core`, mas `core` não deve depender de uma feature.

Consulte a [documentação de `core`](src/app/core/README.md) para entender o fluxo completo e cada subpasta.

### `features`

Cada domínio mantém suas páginas, componentes, modelos e serviços próximos uns dos outros:

- `booking`: criação, consulta, edição e cancelamento de reservas;
- `dashboard`: indicadores operacionais e financeiros atualizados por SSE;
- `login`: autenticação e recuperação de senha;
- `payment`: visão e consulta de pagamentos;
- `refundrequest`: criação e análise de solicitações de reembolso;
- `tours`: passeios e categorias;
- `user`: usuários e relatórios de comissão.

As rotas usam `loadComponent`, mantendo as telas fora do bundle inicial até serem acessadas. O funcionamento especial do tempo real está descrito na [documentação do dashboard](src/app/features/dashboard/README.md).

### `shared`

Reúne código reutilizável por mais de um domínio, como notificações, campos, diálogos, upload de imagem, modelos paginados, pipes e funções de data, moeda e senha. Código específico de negócio deve permanecer na respectiva feature.

## Autenticação e sessão

O access token é mantido somente em memória. O refresh token é administrado pelo backend em cookie e enviado com `withCredentials` nos endpoints de autenticação.

Ao iniciar a aplicação, `initSession` tenta restaurar a sessão em `/auth/refresh`. Depois disso, o guard libera ou bloqueia as rotas privadas. O interceptor adiciona o bearer token às chamadas do backend e tenta renovar a sessão quando recebe `401`.

Esse desenho evita persistir o access token no `localStorage`. Uma atualização completa da página depende do backend e do cookie de refresh estarem disponíveis.

## Padrões do projeto

- Componentes são standalone e suas dependências aparecem no array `imports`.
- Rotas públicas ficam fora do `MainLayout`; rotas privadas são filhas do layout e protegidas pelo `authGuard`.
- Serviços de feature encapsulam chamadas HTTP e regras de acesso da tela.
- Estado derivado deve usar `computed`; estado mutável local deve usar `signal`.
- Inscrições ligadas ao ciclo de vida de componentes devem usar `takeUntilDestroyed`.
- Respostas de erro da API devem passar por `getApiErrorMessage` antes de serem exibidas.
- Arquivos `*.spec.ts` permanecem próximos do código testado.

## Build e testes

Antes de entregar uma alteração, execute:

```bash
npm test
npm run build
```

O build de produção aplica otimizações e limites de tamanho configurados em [`angular.json`](angular.json). Avisos de orçamento devem ser avaliados antes de aumentar esses limites.
