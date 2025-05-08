import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { User, Role } from '@core/models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  error: string | null = null;
  
  // Current filters
  filters = {
    role: 'ALL' as 'ALL' | Role,
    searchTerm: ''
  };
  
  // Dialog state
  showConfirmDialog = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.users];
    
    // Filter by role
    if (this.filters.role !== 'ALL') {
      result = result.filter(user => user.role === this.filters.role);
    }
    
    // Filter by search term
    if (this.filters.searchTerm.trim()) {
      const term = this.filters.searchTerm.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
      );
    }
    
    this.filteredUsers = result;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.filters = {
      role: 'ALL',
      searchTerm: ''
    };
    this.applyFilters();
  }

  editUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }
  
  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showConfirmDialog = true;
  }
  
  cancelDelete(): void {
    this.userToDelete = null;
    this.showConfirmDialog = false;
  }
  
  deleteUser(): void {
    if (!this.userToDelete) return;
    
    const userId = this.userToDelete.id;
    
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.showConfirmDialog = false;
        this.userToDelete = null;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user', err);
        this.error = 'Failed to delete user. Please try again.';
        this.showConfirmDialog = false;
        this.userToDelete = null;
      }
    });
  }
  
  toggleUserStatus(user: User): void {
    this.userService.toggleUserStatus(user.id, !user.active).subscribe({
      next: () => {
        user.active = !user.active; // Update locally
      },
      error: (err) => {
        console.error('Error toggling user status', err);
        this.error = 'Failed to update user status. Please try again.';
      }
    });
  }

  getRoleClass(role: Role): string {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'AGENT': return 'role-agent';
      case 'USER': return 'role-user';
      default: return '';
    }
  }
}