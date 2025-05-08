import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  error: string | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    this.authService.isAuthenticated().then(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  login(): void {
    this.loading = true;
    this.error = null;
    
    try {
      this.authService.login();
    } catch (err) {
      console.error('Error during login', err);
      this.error = 'An error occurred during login. Please try again.';
      this.loading = false;
    }
  }
}