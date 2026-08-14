import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Card } from '../../../../shared/components/card/card';
import { BookingStatusBadge } from '../../../booking/components/booking-status-badge/booking-status-badge';
import { DashboardStatusAmount } from '../../models/dashboard.model';

@Component({
  selector: 'app-confirmation-status',
  imports: [BookingStatusBadge, Card, CurrencyPipe],
  templateUrl: './confirmation-status.html',
  styleUrl: './confirmation-status.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationStatus {
  readonly statuses = input.required<DashboardStatusAmount[]>();
}
