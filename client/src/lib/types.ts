export type Role = 'admin' | 'agent' | 'user';

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

export type Category = {
  id: number;
  name: string;
  description?: string;
};

export type Status = 'open' | 'in_progress' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high';

export type Ticket = {
  id: number;
  subject: string;
  description: string;
  status: Status;
  priority: Priority;
  categoryId?: number;
  createdById: number;
  assignedToId?: number;
  createdAt: string;
  updatedAt: string;
  
  // These fields are added by the API when returning ticket details
  createdBy?: User;
  assignedTo?: User;
  category?: Category;
};

export type Comment = {
  id: number;
  content: string;
  ticketId: number;
  userId: number;
  createdAt: string;
  user?: User;
};

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export type Notification = {
  id: number;
  message: string;
  type: NotificationType;
  userId: number;
  read: boolean;
  ticketId?: number;
  createdAt: string;
};

export type TicketStats = {
  total: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  avgResponseTime: string;
};

export type TicketFilters = {
  status?: Status[];
  priority?: Priority[];
  categoryId?: number;
  assignedToId?: number;
  createdById?: number;
};

export type TicketFormData = {
  subject: string;
  description: string;
  priority: Priority;
  categoryId?: number;
  assignedToId?: number;
};
