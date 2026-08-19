# Domínio de pagamentos

O pagamento representa o sinal associado individualmente a uma reserva. A relação é um-para-um e guarda valor esperado, URL do comprovante e instante de pagamento.

## Regra do sinal

O valor esperado é calculado por `Booking.calculateRequiredDeposit`:

```text
(total bruto − desconto manual + taxa de embarque) × 20%
```

O resultado usa duas casas decimais com arredondamento `HALF_UP`.

## `PaymentService`

- `getOverview`: agrega sinal recebido, valores aguardando comprovante e saldo restante; nulos vindos das projeções viram zero;
- `searchReservations`: encontra reservas relevantes para o fluxo financeiro;
- `findAllByNameClientOrId`, `findByStatusBooking` e `findById`: fornecem páginas e detalhe administrativo com cache;
- `createReservationPayment`: cria o pagamento dentro do agregado quando há comprovante; não salva isoladamente porque a reserva controla a persistência;
- `updateExpectedAmount`: recalcula apenas quando já existe pagamento. Uma reserva sem comprovante não ganha pagamento implicitamente por causa de outra edição.

Alterações limpam caches de páginas e detalhes. A URL do comprovante pode ser substituída durante a edição da reserva.
