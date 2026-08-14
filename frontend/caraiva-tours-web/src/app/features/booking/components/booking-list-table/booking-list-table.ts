import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { BookingSummary } from '../../models/booking.model';
import { BookingStatusBadge } from '../booking-status-badge/booking-status-badge';

@Component({
  selector: 'app-booking-list-table',
  imports: [BookingStatusBadge, ButtonModule, CurrencyPipe, DatePipe, PIcon, TableModule],
  templateUrl: './booking-list-table.html',
  styleUrl: './booking-list-table.css',
})
export class BookingListTable {
  readonly bookings = input.required<BookingSummary[]>();
  readonly loading = input(false);
  readonly isAdmin = input(false);
  readonly currentUserId = input<number | null>(null);

  readonly view = output<BookingSummary>();
  readonly edit = output<BookingSummary>();
  readonly receipt = output<BookingSummary>();
  readonly confirm = output<BookingSummary>();
  readonly cancel = output<BookingSummary>();

  protected canEdit(booking: BookingSummary): boolean {
    return (
      (booking.status === 'DRAFT' || booking.status === 'CONFIRMED') &&
      (this.isAdmin() || booking.attendantId === this.currentUserId())
    );
  }

  protected canOpenReport(booking: BookingSummary): boolean {
    return booking.status === 'CONFIRMED' || booking.status === 'COMPLETED';
  }
}
