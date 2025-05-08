import { Ticket } from "./ticket.model";

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  userId: number;
  read: boolean;
  ticketId?: number;
  ticket?: Ticket;
  createdAt: string;
}