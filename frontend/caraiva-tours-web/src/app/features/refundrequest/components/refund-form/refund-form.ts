import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';

import { CreateRefundRequest, RefundBookingOption } from '../../models/refund-request.model';

const BOOKING_STATUS_LABELS: Record<RefundBookingOption['status'], string> = {
  DRAFT: 'Rascunho',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Concluída',
};

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

@Component({
  selector: 'app-refund-form',
  imports: [ButtonModule, PIcon, ReactiveFormsModule, SelectModule, TextareaModule],
  templateUrl: './refund-form.html',
  styleUrl: './refund-form.css',
})
export class RefundForm {
  readonly saving = input(false);
  readonly bookings = input.required<RefundBookingOption[]>();
  readonly bookingsLoading = input(false);
  readonly requestSubmitted = output<CreateRefundRequest>();

  protected readonly form = new FormGroup({
    bookingId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { bookingId, reason } = this.form.getRawValue();
    if (bookingId === null) return;
    this.requestSubmitted.emit({ bookingId, reason: reason.trim() });
  }

  protected bookingDate(schedule: string): string {
    return DATE_FORMATTER.format(new Date(schedule));
  }

  protected bookingTime(schedule: string): string {
    return TIME_FORMATTER.format(new Date(schedule));
  }

  protected bookingStatusLabel(status: RefundBookingOption['status']): string {
    return BOOKING_STATUS_LABELS[status];
  }

  reset(): void {
    this.form.reset({ bookingId: null, reason: '' });
  }
}
