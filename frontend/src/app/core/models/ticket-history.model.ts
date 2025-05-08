import { User } from "./user.model";

export interface TicketHistory {
  id: number;
  ticketId: number;
  userId: number;
  user?: User;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}