import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endpoint = 'categories';

  constructor(private apiService: ApiService) {}

  getCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.endpoint);
  }

  getCategory(id: number): Observable<Category> {
    return this.apiService.get<Category>(`${this.endpoint}/${id}`);
  }

  createCategory(category: { name: string, description?: string }): Observable<Category> {
    return this.apiService.post<Category>(this.endpoint, category);
  }

  updateCategory(id: number, category: { name?: string, description?: string }): Observable<Category> {
    return this.apiService.put<Category>(`${this.endpoint}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}