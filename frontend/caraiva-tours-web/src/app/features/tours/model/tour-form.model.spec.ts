import { emptyTourForm, tourFormToRequest, tourToForm } from './tour-form.model';
import { Tour } from './tour.model';

describe('TourFormModel', () => {
  it('converte horas e minutos para a duração ISO esperada pelo backend', () => {
    const form = emptyTourForm();
    form.duration = { hours: 4, minutes: 30 };

    expect(tourFormToRequest(form)?.duration).toBe('PT4H30M');
  });

  it('converte uma duração somente em minutos', () => {
    const form = emptyTourForm();
    form.duration = { hours: 0, minutes: 45 };

    expect(tourFormToRequest(form)?.duration).toBe('PT45M');
  });

  it('recusa uma duração zerada', () => {
    const form = emptyTourForm();
    form.duration = { hours: 0, minutes: 0 };

    expect(tourFormToRequest(form)).toBeNull();
  });

  it('preenche o formulário de edição a partir da duração do backend', () => {
    const tour = {
      id: 1,
      name: 'Passeio',
      description: 'Descrição',
      basePricePerPerson: 100,
      promoPricePerPerson: 80,
      commissionType: 'PERCENTAGE',
      commissionValue: 10,
      duration: 'PT2H15M',
      available: true,
      imageUrl: '',
      isPromotional: false,
      category: { id: 2, name: 'Praia' },
    } as Tour;

    expect(tourToForm(tour).duration).toEqual({ hours: 2, minutes: 15 });
  });
});
