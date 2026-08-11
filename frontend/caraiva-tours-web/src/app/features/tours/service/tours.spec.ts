import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SessionStore } from '../../../core/auth/session/session-store';
import { TourRequest } from '../model/tour.model';
import { Tours } from './tours';

describe('Tours', () => {
  let service: Tours;
  let httpTesting: HttpTestingController;
  const hasPermissionAdmin = vi.fn();
  const tourRequest: TourRequest = {
    name: 'Passeio',
    description: 'Descrição',
    basePricePerPerson: 100,
    promoPricePerPerson: 80,
    commissionType: 'PERCENTAGE',
    commissionValue: 10,
    duration: 'PT4H',
    available: true,
    imageUrl: 'https://imagem.test/passeio.jpg',
    isPromotional: false,
    categoryTourId: 2,
  };

  beforeEach(() => {
    hasPermissionAdmin.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SessionStore, useValue: { hasPermissionAdmin } },
      ],
    });
    service = TestBed.inject(Tours);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('lista passeios com filtros e categoria', () => {
    service.getTours(' praia ', 1, 6, 9).subscribe();
    const request = httpTesting.expectOne(
      (req) => req.url === '/api/tours' && req.params.get('categoryId') === '9',
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('search')).toBe('praia');
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('size')).toBe('6');
    expect(request.request.params.get('sort')).toBe('name,desc');
    request.flush({ content: [] });
  });

  it('omite a categoria quando o filtro não foi informado', () => {
    service.getTours().subscribe();
    const request = httpTesting.expectOne((req) => req.url === '/api/tours');
    expect(request.request.params.has('categoryId')).toBe(false);
    request.flush({ content: [] });
  });

  it('altera a disponibilidade após validar permissão', () => {
    service.setAvailableTour(5, false).subscribe();
    expect(hasPermissionAdmin).toHaveBeenCalledOnce();
    const request = httpTesting.expectOne('/api/tours/5');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ available: false });
    request.flush({});
  });

  it('cria um passeio após validar permissão', () => {
    service.createTour(tourRequest).subscribe();
    expect(hasPermissionAdmin).toHaveBeenCalledOnce();
    const request = httpTesting.expectOne('/api/tours');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(tourRequest);
    request.flush({});
  });

  it('atualiza um passeio após validar permissão', () => {
    service.updateTour(6, tourRequest).subscribe();
    expect(hasPermissionAdmin).toHaveBeenCalledOnce();
    const request = httpTesting.expectOne('/api/tours/6');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(tourRequest);
    request.flush({});
  });

  it('exclui um passeio após validar permissão', () => {
    service.deleteTour(8).subscribe();
    expect(hasPermissionAdmin).toHaveBeenCalledOnce();
    const request = httpTesting.expectOne('/api/tours/8');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
