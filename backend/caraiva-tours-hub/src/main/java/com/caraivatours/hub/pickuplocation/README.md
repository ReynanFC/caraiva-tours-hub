# Local de embarque

O local de embarque é criado como parte da reserva e preserva CEP, nome, referência e a taxa realmente aplicada naquela venda.

`PickupLocationService.createPickupLocation` transforma o DTO em entidade e persiste esse snapshot. Taxa ausente é normalizada para zero pelo construtor.

Na edição da reserva, os campos do mesmo registro são atualizados. Se a taxa mudar, `BookingService` recalcula o total final e o sinal esperado. Isso evita depender de uma tabela de preços futura para reproduzir o valor negociado no passado.
