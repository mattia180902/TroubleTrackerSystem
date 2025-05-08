import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './auth.guard';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard extends AuthGuard {
  constructor(
    protected override readonly router: Router,
    protected override readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const result = await super.isAccessAllowed(route, state);
    
    if (result === false) {
      return false;
    }
    
    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];
    
    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }
    
    // Check if the user has any of the required roles
    const hasRequiredRole = requiredRoles.some(role => this.keycloak.isUserInRole(role));
    
    if (!hasRequiredRole) {
      // Redirect to dashboard if the user doesn't have the required role
      return this.router.parseUrl('/dashboard');
    }
    
    return true;
  }
}