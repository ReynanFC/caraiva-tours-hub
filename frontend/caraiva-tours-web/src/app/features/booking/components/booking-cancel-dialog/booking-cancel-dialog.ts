import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';

import { BookingSummary } from '../../models/booking.model';

@Component({
  selector: 'app-booking-cancel-dialog',
  imports: [ButtonModule, FormsModule, PIcon, TextareaModule],
  templateUrl: './booking-cancel-dialog.html',
  styleUrl: './booking-cancel-dialog.css',
})
export class BookingCancelDialog {
  private readonly dialogRef = inject(DynamicDialogRef);

  readonly booking = input.required<BookingSummary>();
  readonly onConfirm = input.required<(reason: string) => void>();

  protected reason = '';

  protected close(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    const reason = this.reason.trim();
    if (!reason || reason.length > 255) return;
    this.onConfirm()(reason);
    this.dialogRef.close();
  }
}
