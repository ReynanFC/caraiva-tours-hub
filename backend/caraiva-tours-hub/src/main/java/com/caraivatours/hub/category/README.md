# Domínio de categorias

Categorias organizam o catálogo e são compartilhadas por vários passeios.

## `CategoryTourService`

- `findEntityById` é a busca interna usada por outros domínios e lança `ResourceNotFoundException` quando necessário;
- `findById`, `findAll` e `findOptions` expõem, respectivamente, detalhe, página com quantidade de passeios e até 20 opções para seletores;
- `addCategoryTour` impede nome duplicado;
- `updateCategoryTour` altera a categoria existente e invalida todas as visões do catálogo;
- `deleteCategoryTour` impede exclusão quando a categoria possui passeios ativos, preservando referências operacionais.

Na entidade, `addTour` e `removeTour` sincronizam os dois lados do relacionamento. O service usa esses métodos ao criar ou mover um passeio.

Consultas são separadas nos caches `category`, `categories` e `category-options`. Escritas invalidam listas/opções; alterações de passeio também invalidam categorias porque a contagem e o vínculo exibidos podem mudar.
