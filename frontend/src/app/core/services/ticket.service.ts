import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Ticket, TicketFormData, TicketStats } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private endpoint = 'tickets';

  constructor(private apiService: ApiService) {}

  getTickets(filters?: any): Observable<Ticket[]> {
    return this.apiService.get<Ticket[]>(this.endpoint, filters);
  }

  getTicket(id: number): Observable<Ticket> {
    return this.apiService.get<Ticket>(`${this.endpoint}/${id}`);
  }

  createTicket(ticket: TicketFormData): Observable<Ticket> {
    return this.apiService.post<Ticket>(this.endpoint, ticket);
  }

  updateTicket(id: number, ticket: Partial<TicketFormData>): Observable<Ticket> {
    return this.apiService.put<Ticket>(`${this.endpoint}/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getTicketStats(): Observable<TicketStats> {
    return this.apiService.get<TicketStats>('stats');
  }

  // Method to add a comment to a ticket
  addComment(ticketId: number, content: string): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${ticketId}/comments`, { content });
  }

  // Method to get comments for a ticket
  getComments(ticketId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/${ticketId}/comments`);
  }

  // Method to delete a comment
  deleteComment(commentId: number): Observable<void> {
    return this.apiService.delete<void>(`comments/${commentId}`);
  }
}