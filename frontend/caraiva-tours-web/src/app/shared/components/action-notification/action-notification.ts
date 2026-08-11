import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ACTION_NOTIFICATION_KEY, ActionNotificationService } from './action-notification.service';

@Component({
  selector: 'app-action-notification',
  imports: [ToastModule],
  providers: [
    {
      provide: MessageService,
      useFactory: (notifications: ActionNotificationService) => notifications.messages,
      deps: [ActionNotificationService],
    },
  ],
  template: `<p-toast [key]="key" position="top-right" />`,
  styleUrl: './action-notification.css',
})
export class ActionNotification {
  protected readonly key = ACTION_NOTIFICATION_KEY;
  private readonly notifications = inject(ActionNotificationService);
}
