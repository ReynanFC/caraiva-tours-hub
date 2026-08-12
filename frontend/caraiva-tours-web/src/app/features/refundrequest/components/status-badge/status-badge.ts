import { Component, computed, input } from '@angular/core';

import { RefundStatus } from '../../models/refund-request.model';

const STATUS_LABELS: Record<RefundStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
};

@Component({
  selector: 'app-refund-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class RefundStatusBadge {
  readonly status = input.required<RefundStatus>();
  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
}
