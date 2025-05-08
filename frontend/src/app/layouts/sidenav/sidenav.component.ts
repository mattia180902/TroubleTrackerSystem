import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

interface NavItem {
  name: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'fa-tachometer-alt', route: '/dashboard', roles: ['ADMIN', 'AGENT', 'USER'] },
    { name: 'Tickets', icon: 'fa-ticket-alt', route: '/tickets', roles: ['ADMIN', 'AGENT', 'USER'] },
    { name: 'Users', icon: 'fa-users', route: '/users', roles: ['ADMIN'] },
    { name: 'Categories', icon: 'fa-tags', route: '/categories', roles: ['ADMIN'] },
    { name: 'Reports', icon: 'fa-chart-bar', route: '/reports', roles: ['ADMIN', 'AGENT'] }
  ];

  filteredNavItems: NavItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.filterNavItemsByRole();
  }

  filterNavItemsByRole(): void {
    const userRoles = this.authService.getUserRoles();
    
    this.filteredNavItems = this.navItems.filter(item => 
      item.roles.some(role => userRoles.includes(role))
    );
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }
}