import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@core/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private keycloak: KeycloakService,
    private http: HttpClient
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.http.get<User>(`${environment.apiUrl}/users/me`)
      .subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: (error) => {
          console.error('Error loading current user', error);
          this.currentUserSubject.next(null);
        }
      });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): Promise<boolean> {
    return this.keycloak.isLoggedIn();
  }

  public getUserRoles(): string[] {
    return this.keycloak.getUserRoles();
  }

  public hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  public login(): void {
    this.keycloak.login();
  }

  public logout(): void {
    this.keycloak.logout(window.location.origin);
  }
}