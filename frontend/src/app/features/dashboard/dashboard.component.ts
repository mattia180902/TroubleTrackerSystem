import { Component, OnInit } from '@angular/core';
import { TicketService } from '@core/services/ticket.service';
import { TicketStats } from '@core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: TicketStats | null = null;
  loading = true;
  error: string | null = null;

  // Charts data
  statusChartData: any[] = [];
  priorityChartData: any[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.ticketService.getTicketStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.error = 'Failed to load dashboard data. Please try again later.';
        this.loading = false;
      }
    });
  }

  prepareChartData(): void {
    if (!this.stats) return;

    // Prepare status chart data
    this.statusChartData = [
      { name: 'Open', value: this.stats.openTickets },
      { name: 'In Progress', value: this.stats.inProgressTickets },
      { name: 'Resolved', value: this.stats.resolvedTickets },
      { name: 'Closed', value: this.stats.closedTickets }
    ];

    // Prepare priority chart data
    this.priorityChartData = [
      { name: 'High', value: this.stats.highPriorityCount },
      { name: 'Medium', value: this.stats.mediumPriorityCount },
      { name: 'Low', value: this.stats.lowPriorityCount }
    ];
  }

  refresh(): void {
    this.loadDashboardData();
  }
}