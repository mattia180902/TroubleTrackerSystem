import { Component, OnInit } from '@angular/core';
import { User } from '@core/models';
import { AuthService } from '@core/auth/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  currentUser: User | null = null;
  unreadNotificationsCount = 0;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Subscribe to the current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUnreadNotifications();
      }
    });
  }

  loadUnreadNotifications(): void {
    this.notificationService.getUnreadNotifications().subscribe(notifications => {
      this.unreadNotificationsCount = notifications.length;
    });
  }
}