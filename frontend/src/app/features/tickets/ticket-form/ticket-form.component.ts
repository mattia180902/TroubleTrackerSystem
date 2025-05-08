import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '@core/services/ticket.service';
import { CategoryService } from '@core/services/category.service';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/auth/auth.service';
import { Ticket, Category, User, Status, Priority } from '@core/models';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  ticketForm: FormGroup;
  ticketId?: number;
  isEditMode = false;
  existingTicket?: Ticket;
  
  categories: Category[] = [];
  agents: User[] = [];
  currentUser: User | null = null;
  
  loading = false;
  submitting = false;
  error: string | null = null;
  
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.ticketForm = this.createForm();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      // Set default priority based on user role
      if (user && this.ticketForm && !this.isEditMode) {
        const defaultPriority = user.role === 'USER' ? 'MEDIUM' : 'LOW';
        this.ticketForm.get('priority')?.setValue(defaultPriority);
      }
    });
    
    this.loadFormData();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.ticketId = +params['id'];
        this.isEditMode = true;
        this.loadTicket();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['OPEN', Validators.required],
      priority: ['MEDIUM', Validators.required],
      categoryId: [null],
      assignedToId: [null]
    });
  }

  loadFormData(): void {
    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });

    // Load agents (users with ADMIN or AGENT role)
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.agents = data.filter(user => 
          user.role === 'ADMIN' || user.role === 'AGENT'
        );
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  loadTicket(): void {
    if (!this.ticketId) return;
    
    this.loading = true;
    this.error = null;
    
    this.ticketService.getTicket(this.ticketId).subscribe({
      next: (ticket) => {
        this.existingTicket = ticket;
        this.updateForm(ticket);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading ticket', err);
        this.error = 'Failed to load ticket details. Please try again.';
        this.loading = false;
      }
    });
  }

  updateForm(ticket: Ticket): void {
    this.ticketForm.patchValue({
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      categoryId: ticket.categoryId || null,
      assignedToId: ticket.assignedToId || null
    });
    
    // If the user is not an admin or agent, disable the status field
    if (this.currentUser && this.currentUser.role === 'USER') {
      this.ticketForm.get('status')?.disable();
      this.ticketForm.get('assignedToId')?.disable();
    }
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) return;
    
    this.submitting = true;
    
    const formData = this.ticketForm.value;
    
    // If we're in edit mode
    if (this.isEditMode && this.ticketId) {
      this.ticketService.updateTicket(this.ticketId, formData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/tickets', this.ticketId]);
        },
        error: (err) => {
          console.error('Error updating ticket', err);
          this.error = 'Failed to update ticket. Please try again.';
          this.submitting = false;
        }
      });
    } 
    // If we're creating a new ticket
    else {
      this.ticketService.createTicket(formData).subscribe({
        next: (ticket) => {
          this.submitting = false;
          this.router.navigate(['/tickets', ticket.id]);
        },
        error: (err) => {
          console.error('Error creating ticket', err);
          this.error = 'Failed to create ticket. Please try again.';
          this.submitting = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.ticketId) {
      this.router.navigate(['/tickets', this.ticketId]);
    } else {
      this.router.navigate(['/tickets']);
    }
  }
  
  // Helper methods for form validation
  get subjectControl() { return this.ticketForm.get('subject'); }
  get descriptionControl() { return this.ticketForm.get('description'); }
}