# HTTP e erros da API

`api-error.ts` centraliza os formatos de erro esperados e converte respostas técnicas em mensagens adequadas para a interface.

`getApiErrorMessage(error, fallback)` aceita erros HTTP com corpo JSON, texto ou `Blob`. Ele prioriza erros de validação, depois a mensagem geral da API e, quando nenhum formato conhecido existe, usa o fallback informado pela tela.

As traduções exatas ficam em `src/assets/i18n/errors-pt.json`. Mensagens que contêm valores dinâmicos, como IDs e e-mails, são tratadas por expressões regulares em `DYNAMIC_API_MESSAGE_TRANSLATIONS`.

Ao adicionar um novo erro:

1. prefira incluir mensagens estáticas no arquivo JSON;
2. use um padrão dinâmico apenas quando parte da mensagem variar;
3. sempre mantenha um fallback contextual no componente chamador;
4. preserve `traceId`, quando retornado, nos contratos para facilitar diagnóstico.

