import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { User, Role } from '@core/models';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId?: number;
  isEditMode = false;
  existingUser?: User;
  
  loading = false;
  submitting = false;
  error: string | null = null;
  
  roleOptions: {value: Role, label: string}[] = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'AGENT', label: 'Support Agent' },
    { value: 'USER', label: 'Regular User' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.isEditMode = true;
        this.loadUser();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      role: ['USER', Validators.required],
      department: [''],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]]
    });
  }

  loadUser(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.error = null;
    
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.existingUser = user;
        this.updateForm(user);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user', err);
        this.error = 'Failed to load user details. Please try again.';
        this.loading = false;
      }
    });
  }

  updateForm(user: User): void {
    // Get password control
    const passwordControl = this.userForm.get('password');
    
    // When editing, password is optional
    if (passwordControl && this.isEditMode) {
      passwordControl.setValidators([]); // Remove validators
      passwordControl.updateValueAndValidity();
    }
    
    this.userForm.patchValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department || ''
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    
    this.submitting = true;
    
    const formData = this.userForm.value;
    
    // Remove empty password when editing
    if (this.isEditMode && !formData.password) {
      delete formData.password;
    }
    
    // If we're in edit mode
    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, formData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error updating user', err);
          this.error = 'Failed to update user. Please try again.';
          this.submitting = false;
        }
      });
    } 
    // If we're creating a new user
    else {
      this.userService.createUser(formData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error creating user', err);
          this.error = 'Failed to create user. Please try again.';
          this.submitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
  
  // Helper methods for form validation
  get usernameControl() { return this.userForm.get('username'); }
  get firstNameControl() { return this.userForm.get('firstName'); }
  get lastNameControl() { return this.userForm.get('lastName'); }
  get emailControl() { return this.userForm.get('email'); }
  get passwordControl() { return this.userForm.get('password'); }
}