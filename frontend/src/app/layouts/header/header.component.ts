import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@core/models';
import { AuthService } from '@core/auth/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() currentUser: User | null = null;
  @Input() unreadNotifications = 0;
  
  showNotificationsDropdown = false;
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    if (this.currentUser) {
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications.slice(0, 5); // Get last 5 notifications
      });
    }
  }

  toggleNotifications(): void {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    if (this.showNotificationsDropdown) {
      this.loadNotifications();
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.unreadNotifications = 0;
      this.loadNotifications();
    });
  }

  logout(): void {
    this.authService.logout();
  }
}