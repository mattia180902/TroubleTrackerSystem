import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '@core/services/ticket.service';
import { CategoryService } from '@core/services/category.service';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/auth/auth.service';
import { Ticket, Category, User, Status, Priority } from '@core/models';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  categories: Category[] = [];
  users: User[] = [];
  currentUser: User | null = null;
  
  loading = false;
  error: string | null = null;
  
  // Filter options
  statusOptions: {value: Status, label: string}[] = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' }
  ];
  
  priorityOptions: {value: Priority, label: string}[] = [
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
  ];
  
  // Current filters
  filters: {
    status: Status[] | null,
    priority: Priority[] | null,
    categoryId: number | null,
    assignedToId: number | null,
    createdById: number | null,
    searchTerm: string | null
  } = {
    status: null,
    priority: null,
    categoryId: null,
    assignedToId: null,
    createdById: null,
    searchTerm: null
  };

  constructor(
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadFiltersData();
    this.loadTickets();
  }

  loadFiltersData(): void {
    // Load categories for filters
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });

    // Load users for filters
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  loadTickets(): void {
    this.loading = true;
    this.error = null;
    
    // Prepare filter object with only non-null values
    const activeFilters: any = {};
    
    Object.entries(this.filters).forEach(([key, value]) => {
      if (value !== null) {
        activeFilters[key] = value;
      }
    });
    
    this.ticketService.getTickets(activeFilters).subscribe({
      next: (data) => {
        this.tickets = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tickets', err);
        this.error = 'Failed to load tickets. Please try again.';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadTickets();
  }

  resetFilters(): void {
    this.filters = {
      status: null,
      priority: null,
      categoryId: null,
      assignedToId: null,
      createdById: null,
      searchTerm: null
    };
    this.loadTickets();
  }

  viewTicket(ticket: Ticket): void {
    this.router.navigate(['/tickets', ticket.id]);
  }

  editTicket(ticket: Ticket): void {
    this.router.navigate(['/tickets', ticket.id, 'edit']);
  }

  createTicket(): void {
    this.router.navigate(['/tickets/new']);
  }
  
  canEditTicket(ticket: Ticket): boolean {
    if (!this.currentUser) return false;
    
    // Admin can edit any ticket
    if (this.currentUser.role === 'ADMIN') return true;
    
    // Agents can edit tickets assigned to them or unassigned
    if (this.currentUser.role === 'AGENT') {
      return ticket.assignedToId === this.currentUser.id || !ticket.assignedToId;
    }
    
    // Users can only edit their own tickets that are not closed or resolved
    if (this.currentUser.role === 'USER') {
      return ticket.createdById === this.currentUser.id && 
             !['CLOSED', 'RESOLVED'].includes(ticket.status);
    }
    
    return false;
  }

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-progress';
      case 'RESOLVED': return 'status-resolved';
      case 'CLOSED': return 'status-closed';
      default: return '';
    }
  }
}