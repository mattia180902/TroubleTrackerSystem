import { Category } from "./category.model";
import { User } from "./user.model";

export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: Status;
  priority: Priority;
  categoryId?: number;
  category?: Category;
  createdById: number;
  createdBy?: User;
  assignedToId?: number;
  assignedTo?: User;
  comments?: Comment[];
  history?: TicketHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketFormData {
  subject: string;
  description: string;
  status: Status;
  priority: Priority;
  categoryId?: number;
  assignedToId?: number;
}