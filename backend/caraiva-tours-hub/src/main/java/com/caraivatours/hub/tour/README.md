# Domínio de passeios

O domínio mantém o produto vendido pela agência: descrição, duração, imagem, disponibilidade, preços, categoria e regra de comissão.

## Regras da entidade `Tour`

- `getEffectivePrice`: quando `isPromotional` está ativo, usa `promoPricePerPerson`; caso contrário usa o preço-base;
- `calculateCommissionPerPerson`: para `PERCENTAGE`, multiplica o preço unitário pelo percentual e divide por 100 com precisão intermediária; para comissão fixa, retorna diretamente `commissionValue`.

Esses métodos são usados por `Booking.updateFinancials`, garantindo que o snapshot da reserva nasça com a mesma regra do catálogo.

## `TourService`

- `findById` fornece a entidade para outros casos de uso;
- `findAll` oferece busca/paginação e só armazena no cache consultas sem texto;
- `createTour` rejeita nome repetido, exige categoria existente e usa `category.addTour`;
- `updateTour` detecta transição de categoria antes de aplicar o mapper, removendo da antiga e adicionando à nova;
- `changeAvailable` ativa/desativa sem apagar o passeio e seu histórico;
- `deleteTour` desfaz o vínculo bidirecional antes da remoção.

Todas as escritas invalidam caches de passeios e categorias, pois ambas as respostas dependem desse relacionamento.
