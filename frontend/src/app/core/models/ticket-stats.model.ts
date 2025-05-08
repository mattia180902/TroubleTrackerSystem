export interface TicketStats {
  total: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  avgResponseTime: string;
}