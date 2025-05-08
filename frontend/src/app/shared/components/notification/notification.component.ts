import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Notification } from '@core/models';
import { NotificationService } from '@core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notification!: Notification;
  
  private markAsReadTimeout: any;
  private subscriptions: Subscription[] = [];
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    // Auto-mark as read after a few seconds if it's unread
    if (this.notification && !this.notification.read) {
      this.markAsReadTimeout = setTimeout(() => {
        this.markAsRead();
      }, 5000); // 5 seconds
    }
  }
  
  ngOnDestroy(): void {
    // Clear the timeout if component is destroyed
    if (this.markAsReadTimeout) {
      clearTimeout(this.markAsReadTimeout);
    }
    
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  markAsRead(): void {
    if (this.notification && !this.notification.read) {
      const sub = this.notificationService.markAsRead(this.notification.id).subscribe({
        next: () => {
          this.notification.read = true;
        },
        error: (err) => {
          console.error('Error marking notification as read', err);
        }
      });
      
      this.subscriptions.push(sub);
    }
  }
  
  getNotificationClass(): string {
    if (!this.notification) return '';
    
    let classes = `notification-${this.notification.type.toLowerCase()}`;
    
    if (!this.notification.read) {
      classes += ' unread';
    }
    
    return classes;
  }
  
  getIcon(): string {
    if (!this.notification) return 'fa-bell';
    
    switch (this.notification.type) {
      case 'INFO': return 'fa-info-circle';
      case 'WARNING': return 'fa-exclamation-triangle';
      case 'SUCCESS': return 'fa-check-circle';
      case 'ERROR': return 'fa-exclamation-circle';
      default: return 'fa-bell';
    }
  }
}