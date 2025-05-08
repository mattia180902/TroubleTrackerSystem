import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notification } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private endpoint = 'notifications';

  constructor(private apiService: ApiService) {}

  getNotifications(): Observable<Notification[]> {
    return this.apiService.get<Notification[]>(this.endpoint);
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.apiService.get<Notification[]>(`${this.endpoint}/unread`);
  }

  markAsRead(id: number): Observable<boolean> {
    return this.apiService.post<boolean>(`${this.endpoint}/mark-read/${id}`, {});
  }

  markAllAsRead(): Observable<boolean> {
    return this.apiService.post<boolean>(`${this.endpoint}/mark-all-read`, {});
  }
}