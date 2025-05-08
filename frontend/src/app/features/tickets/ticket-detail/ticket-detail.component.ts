import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '@core/services/ticket.service';
import { AuthService } from '@core/auth/auth.service';
import { Ticket, User, Comment } from '@core/models';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  comments: Comment[] = [];
  currentUser: User | null = null;
  
  ticketId!: number;
  loading = true;
  error: string | null = null;
  commentForm: FormGroup;
  submittingComment = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.route.params.subscribe(params => {
      this.ticketId = +params['id'];
      this.loadTicketData();
    });
  }

  loadTicketData(): void {
    this.loading = true;
    this.error = null;

    this.ticketService.getTicket(this.ticketId).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loadComments();
      },
      error: (err) => {
        console.error('Error loading ticket', err);
        this.error = 'Failed to load ticket details. Please try again.';
        this.loading = false;
      }
    });
  }

  loadComments(): void {
    this.ticketService.getComments(this.ticketId).subscribe({
      next: (data) => {
        this.comments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.error = 'Failed to load comments. Please try again.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  editTicket(): void {
    this.router.navigate(['/tickets', this.ticketId, 'edit']);
  }

  submitComment(): void {
    if (this.commentForm.invalid) return;
    
    const content = this.commentForm.get('content')?.value;
    
    this.submittingComment = true;
    this.ticketService.addComment(this.ticketId, content).subscribe({
      next: () => {
        this.submittingComment = false;
        this.commentForm.reset();
        this.loadComments();
      },
      error: (err) => {
        console.error('Error submitting comment', err);
        this.submittingComment = false;
      }
    });
  }

  canEditTicket(): boolean {
    if (!this.currentUser || !this.ticket) return false;
    
    // Admin can edit any ticket
    if (this.currentUser.role === 'ADMIN') return true;
    
    // Agents can edit tickets assigned to them or unassigned
    if (this.currentUser.role === 'AGENT') {
      return this.ticket.assignedToId === this.currentUser.id || !this.ticket.assignedToId;
    }
    
    // Users can only edit their own tickets that are not closed or resolved
    if (this.currentUser.role === 'USER') {
      return this.ticket.createdById === this.currentUser.id && 
             !['CLOSED', 'RESOLVED'].includes(this.ticket.status);
    }
    
    return false;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-progress';
      case 'RESOLVED': return 'status-resolved';
      case 'CLOSED': return 'status-closed';
      default: return '';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}