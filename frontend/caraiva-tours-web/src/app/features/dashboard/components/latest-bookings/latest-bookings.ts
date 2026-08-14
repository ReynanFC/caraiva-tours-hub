import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Card } from '../../../../shared/components/card/card';
import { BookingStatusBadge } from '../../../booking/components/booking-status-badge/booking-status-badge';
import { LatestBooking } from '../../models/dashboard.model';

@Component({
  selector: 'app-latest-bookings',
  imports: [BookingStatusBadge, Card, CurrencyPipe, DatePipe],
  templateUrl: './latest-bookings.html',
  styleUrl: './latest-bookings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestBookings {
  readonly bookings = input.required<LatestBooking[]>();
}
