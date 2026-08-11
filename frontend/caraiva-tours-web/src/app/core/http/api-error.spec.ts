import { HttpErrorResponse } from '@angular/common/http';

import { getApiErrorMessage, translateApiMessage } from './api-error';

describe('API error translation', () => {
  it('should translate an exact backend message', () => {
    expect(translateApiMessage('Cannot delete tour: it has associated bookings')).toBe(
      'Não é possível excluir o passeio porque ele possui reservas vinculadas.',
    );
  });

  it('should preserve dynamic values while translating', () => {
    expect(translateApiMessage('Tour not found with ID: 42')).toBe(
      'Passeio não encontrado com o ID: 42.',
    );
  });

  it('should translate every validation message returned by the backend', async () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        errors: {
          name: 'Tour name is required',
          price: 'Base price must be zero or a positive value',
        },
      },
    });

    await expect(getApiErrorMessage(error, 'Erro inesperado.')).resolves.toBe(
      'O nome do passeio é obrigatório. O preço base não pode ser negativo.',
    );
  });

  it('should keep messages that are already in Portuguese', () => {
    expect(translateApiMessage('Você não tem permissão para realizar esta operação.')).toBe(
      'Você não tem permissão para realizar esta operação.',
    );
  });
});
