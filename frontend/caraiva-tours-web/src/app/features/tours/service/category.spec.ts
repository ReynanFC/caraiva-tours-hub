import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Category } from './category';

describe('Category', () => {
  let service: Category;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Category);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('lista categorias com busca, paginação e ordenação', () => {
    service.getCategories(' praia ', 2, 20).subscribe();
    const request = httpTesting.expectOne(
      (req) => req.url === '/api/categories' && req.params.get('search') === 'praia',
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('20');
    expect(request.request.params.get('sort')).toBe('name,asc');
    request.flush({ content: [] });
  });

  it('busca uma categoria pelo ID', () => {
    service.getCategory(7).subscribe();
    const request = httpTesting.expectOne('/api/categories/7');
    expect(request.request.method).toBe('GET');
    request.flush({ id: 7, name: 'Praia' });
  });

  it('lista opções de categorias', () => {
    service.getCategoryOptions(' rio ').subscribe();
    const request = httpTesting.expectOne(
      (req) => req.url === '/api/categories/options' && req.params.get('search') === 'rio',
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('cria uma categoria', () => {
    const body = { name: 'Praia' };
    service.createCategory(body).subscribe();
    const request = httpTesting.expectOne('/api/categories');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush({ id: 1, ...body });
  });

  it('atualiza uma categoria', () => {
    const body = { name: 'Rio' };
    service.updateCategory(3, body).subscribe();
    const request = httpTesting.expectOne('/api/categories/3');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(body);
    request.flush({ id: 3, ...body });
  });

  it('exclui uma categoria', () => {
    service.deleteCategory(4).subscribe();
    const request = httpTesting.expectOne('/api/categories/4');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
