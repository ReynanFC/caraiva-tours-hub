# Participantes da reserva

`GroupMember` representa as pessoas adicionais ao organizador da reserva. Cada membro pertence a uma única `Booking`; a reserva controla persistência em cascata e remoção de órfãos.

## `GroupMemberService`

- `createForBooking` transforma DTOs em entidades e já define a reserva proprietária; coleção nula ou vazia resulta em conjunto vazio;
- `findGroupMembers` exige reserva existente e chama a validação de estado da reserva antes de expor os participantes;
- a conversão preserva nome e `isLapChild`.

## Regra atual de quantidade

O organizador não aparece como `GroupMember`; `Booking.calculateTotalParticipants` adiciona automaticamente uma pessoa à quantidade de membros.

O campo `isLapChild` é persistido e retornado pela API. Crianças de colo não entram no cálculo financeiro; os demais membros e o organizador são pagantes.
