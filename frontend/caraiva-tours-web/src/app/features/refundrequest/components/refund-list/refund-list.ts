import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';

import { RefundRequest, RefundStatus } from '../../models/refund-request.model';
import { RefundStatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-refund-list',
  imports: [DatePipe, PIcon, RefundStatusBadge],
  templateUrl: './refund-list.html',
  styleUrl: './refund-list.css',
})
export class RefundList {
  readonly requests = input.required<readonly RefundRequest[]>();
  readonly loading = input(false);
  readonly failed = input(false);
  readonly page = input(0);
  readonly totalPages = input(0);
  readonly adminMode = input(false);
  readonly resolvingId = input<number | null>(null);
  readonly retry = output<void>();
  readonly pageChange = output<number>();
  readonly resolutionRequested = output<{
    id: number;
    status: Extract<RefundStatus, 'APPROVED' | 'REJECTED'>;
  }>();
}
