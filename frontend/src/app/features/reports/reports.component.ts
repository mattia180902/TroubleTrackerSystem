import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TicketService } from '@core/services/ticket.service';
import { CategoryService } from '@core/services/category.service';
import { UserService } from '@core/services/user.service';
import { Category, User, Status, Priority, Ticket, TicketStats } from '@core/models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  // Filter form
  filterForm: FormGroup;
  
  // Data
  tickets: Ticket[] = [];
  categories: Category[] = [];
  users: User[] = [];
  stats: TicketStats | null = null;
  
  // Loading states
  loading = false;
  error: string | null = null;
  
  // Report options
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
  
  // Report visualizations
  statusChartData: any[] = [];
  priorityChartData: any[] = [];
  categoryChartData: any[] = [];
  agentPerformanceData: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  createFilterForm(): FormGroup {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return this.fb.group({
      startDate: [this.formatDateForInput(oneMonthAgo)],
      endDate: [this.formatDateForInput(currentDate)],
      categoryId: [null],
      assignedToId: [null],
      createdById: [null]
    });
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  loadInitialData(): void {
    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });

    // Load users
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
    
    // Get ticket stats
    this.ticketService.getTicketStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error loading ticket stats', err);
      }
    });
    
    // Load report data with current filters
    this.generateReport();
  }

  generateReport(): void {
    this.loading = true;
    this.error = null;
    
    const filters = this.filterForm.value;
    
    // Convert form values to proper filter format
    const queryParams: any = {};
    
    if (filters.startDate) {
      queryParams.startDate = filters.startDate;
    }
    
    if (filters.endDate) {
      queryParams.endDate = filters.endDate;
    }
    
    if (filters.categoryId) {
      queryParams.categoryId = filters.categoryId;
    }
    
    if (filters.assignedToId) {
      queryParams.assignedToId = filters.assignedToId;
    }
    
    if (filters.createdById) {
      queryParams.createdById = filters.createdById;
    }
    
    // Get tickets based on filters
    this.ticketService.getTickets(queryParams).subscribe({
      next: (data) => {
        this.tickets = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error generating report', err);
        this.error = 'Failed to generate report. Please try again.';
        this.loading = false;
      }
    });
  }

  prepareChartData(): void {
    // Prepare status chart data
    const statusCounts = new Map<Status, number>();
    this.statusOptions.forEach(option => statusCounts.set(option.value, 0));
    
    // Prepare priority chart data
    const priorityCounts = new Map<Priority, number>();
    this.priorityOptions.forEach(option => priorityCounts.set(option.value, 0));
    
    // Prepare category chart data
    const categoryCounts = new Map<number, {name: string, count: number}>();
    this.categories.forEach(category => 
      categoryCounts.set(category.id, {name: category.name, count: 0})
    );
    
    // Count tickets by status, priority, and category
    this.tickets.forEach(ticket => {
      // Update status counts
      statusCounts.set(ticket.status, (statusCounts.get(ticket.status) || 0) + 1);
      
      // Update priority counts
      priorityCounts.set(ticket.priority, (priorityCounts.get(ticket.priority) || 0) + 1);
      
      // Update category counts
      if (ticket.categoryId && categoryCounts.has(ticket.categoryId)) {
        const categoryData = categoryCounts.get(ticket.categoryId);
        if (categoryData) {
          categoryData.count++;
        }
      }
    });
    
    // Convert maps to arrays for charts
    this.statusChartData = Array.from(statusCounts.entries())
      .map(([status, count]) => ({
        name: this.getStatusLabel(status),
        value: count
      }));
    
    this.priorityChartData = Array.from(priorityCounts.entries())
      .map(([priority, count]) => ({
        name: this.getPriorityLabel(priority),
        value: count
      }));
    
    this.categoryChartData = Array.from(categoryCounts.values())
      .filter(item => item.count > 0)
      .map(item => ({
        name: item.name,
        value: item.count
      }));
    
    // Prepare agent performance data
    this.calculateAgentPerformance();
  }

  calculateAgentPerformance(): void {
    // Get agents (admin and agent roles)
    const agents = this.users.filter(user => 
      user.role === 'ADMIN' || user.role === 'AGENT'
    );
    
    // Create map to track metrics
    const agentMetrics = new Map<number, {
      name: string,
      resolvedCount: number,
      averageResolutionTime: number,
      totalTickets: number
    }>();
    
    // Initialize agent metrics
    agents.forEach(agent => {
      agentMetrics.set(agent.id, {
        name: `${agent.firstName} ${agent.lastName}`,
        resolvedCount: 0,
        averageResolutionTime: 0,
        totalTickets: 0
      });
    });
    
    // Calculate metrics
    this.tickets.forEach(ticket => {
      if (ticket.assignedToId && agentMetrics.has(ticket.assignedToId)) {
        const metrics = agentMetrics.get(ticket.assignedToId);
        if (metrics) {
          metrics.totalTickets++;
          
          if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
            metrics.resolvedCount++;
            
            // In a real app, we would calculate resolution time from ticket history
            // Here we're just using a placeholder
            const resolutionTime = Math.floor(Math.random() * 72) + 1; // 1-72 hours
            metrics.averageResolutionTime = 
              (metrics.averageResolutionTime * (metrics.resolvedCount - 1) + resolutionTime) / 
              metrics.resolvedCount;
          }
        }
      }
    });
    
    // Convert to array for display
    this.agentPerformanceData = Array.from(agentMetrics.values())
      .filter(metrics => metrics.totalTickets > 0) // Only show agents with tickets
      .sort((a, b) => b.resolvedCount - a.resolvedCount); // Sort by resolved tickets descending
  }

  resetFilters(): void {
    this.filterForm.reset(this.createFilterForm().value);
    this.generateReport();
  }

  exportReport(): void {
    // In a real application, this would generate a CSV or PDF report
    alert('Report export functionality would be implemented here.');
  }

  getStatusLabel(status: Status): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  getPriorityLabel(priority: Priority): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : priority;
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

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  }
}