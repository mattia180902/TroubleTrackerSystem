import { User } from "./user.model";

export interface Comment {
  id: number;
  content: string;
  ticketId: number;
  userId: number;
  user?: User;
  createdAt: string;
}