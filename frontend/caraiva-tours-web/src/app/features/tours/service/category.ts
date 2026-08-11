import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../shared/models/paged-result.model';
import {
  Category as CategoryModel,
  CategoryListItem,
  CategoryRequest,
} from '../model/category.model';

@Service()
export class Category {
  private readonly http = inject(HttpClient);

  getCategories(search = '', page = 0, size = 10): Observable<PagedResult<CategoryListItem>> {
    const params = new HttpParams()
      .set('search', search.trim())
      .set('page', page)
      .set('size', size)
      .set('sort', 'name,asc');

    return this.http.get<PagedResult<CategoryListItem>>('/api/categories', { params });
  }

  getCategory(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`/api/categories/${id}`);
  }

  getCategoryOptions(search = ''): Observable<CategoryModel[]> {
    const params = new HttpParams().set('search', search.trim());

    return this.http.get<CategoryModel[]>('/api/categories/options', { params });
  }

  createCategory(request: CategoryRequest): Observable<CategoryModel> {
    return this.http.post<CategoryModel>('/api/categories', request);
  }

  updateCategory(id: number, request: CategoryRequest): Observable<CategoryModel> {
    return this.http.put<CategoryModel>(`/api/categories/${id}`, request);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/api/categories/${id}`);
  }
}
