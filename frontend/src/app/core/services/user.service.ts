import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, UserFormData } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private apiService: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  getUser(id: number): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/${id}`);
  }

  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/me`);
  }

  createUser(user: UserFormData): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  updateUser(id: number, user: Partial<UserFormData>): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleUserStatus(id: number, active: boolean): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${id}/status`, { active });
  }
}