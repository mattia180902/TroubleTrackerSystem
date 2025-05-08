import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private keycloakService: KeycloakService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Handle authentication status changes
    this.keycloakService.isLoggedIn().then(isLoggedIn => {
      if (!isLoggedIn) {
        // Redirect to login page if not logged in
        this.router.navigate(['/login']);
      }
    });
  }
}