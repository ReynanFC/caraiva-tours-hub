# Dashboard

O dashboard possui duas visões definidas pelo papel da sessão:

- `EMPLOYEE`: métricas pessoais, reservas recentes, status de confirmação, passeios mais solicitados e relatório mensal de comissão;
- `ADMIN`: indicadores financeiros e ranking da equipe, além dos dados operacionais permitidos ao perfil.

## Organização

```text
dashboard/
├── components/ # cards, listas, status e gráficos de apresentação
├── models/     # respostas da API, métricas e eventos do stream
├── pages/      # composição e estado da tela
└── services/   # consultas HTTP e conexão SSE
```

`DashboardService` consulta `/api/dashboard` e `/api/dashboard/finance`, aplicando os parâmetros de período quando informados. A página armazena as respostas em Angular `resource` e deriva os cards por `computed`.

## Atualização em tempo real

`DashboardEventsService` abre `GET /api/dashboard/events` com `fetch`, porque a API nativa `EventSource` não permite enviar o bearer token no header. O serviço interpreta apenas eventos `dashboard-changed` válidos e ignora heartbeats e mensagens malformadas.

Quando o backend informa uma alteração, a página espera 300 ms para agrupar eventos próximos, busca somente a visão afetada e aplica a resposta com `resource.set()`. Isso atualiza os dados sem destruir o componente, reiniciar a rota ou exibir novamente o skeleton de carregamento.

Se o stream cair, o serviço tenta reconectar com espera progressiva de 1 a 15 segundos. Um `401` dispara refresh do token antes da nova tentativa. Após uma reconexão, as visões acessíveis ao usuário são sincronizadas silenciosamente.

A inscrição usa `takeUntilDestroyed`; ao sair da rota, o unsubscribe aciona o `AbortController` e encerra a conexão SSE no navegador. Ao retornar ao dashboard, uma nova conexão é criada.

## Cuidados ao alterar

- Eventos SSE sinalizam invalidação; os dados completos continuam vindo dos endpoints HTTP.
- O campo `view` deve ser `USER` ou `FINANCE` e determina qual consulta será refeita.
- Atualizações silenciosas usam sequência incremental para impedir que uma resposta antiga sobrescreva uma mais recente.
- Componentes de gráfico devem atualizar a instância existente sempre que possível, evitando recriação visual desnecessária.
- Novos tipos de evento precisam ser refletidos nos modelos, no parser, na página e nos testes do serviço.

