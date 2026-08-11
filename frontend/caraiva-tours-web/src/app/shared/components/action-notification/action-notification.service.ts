import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export const ACTION_NOTIFICATION_KEY = 'action-notifications';

@Injectable({ providedIn: 'root' })
export class ActionNotificationService {
  readonly messages = new MessageService();

  success(detail: string): void {
    this.add('success', 'Ação concluída', detail);
  }

  error(detail: string, life = 2_000): void {
    this.add('error', 'Ação não realizada', detail, life);
  }

  clear(): void {
    this.messages.clear(ACTION_NOTIFICATION_KEY);
  }

  private add(severity: 'success' | 'error', summary: string, detail: string, life = 2_000): void {
    this.messages.add({
      key: ACTION_NOTIFICATION_KEY,
      severity,
      summary,
      detail,
      life,
      closable: false,
    });
  }
}
