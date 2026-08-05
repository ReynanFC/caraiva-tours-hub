import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteSelectEvent } from 'primeng/types/autocomplete';
import { finalize } from 'rxjs';

import { Card } from '../../../../shared/components/card/card';
import { ValidationError } from '../../../../core/http/api-error';
import { fromCents, toCents } from '../../../../shared/utils/money.utils';
import { PixProofUpload } from '../../components/pix-proof-upload/pix-proof-upload';
import { TourOption } from '../../models/tour.model';
import { BookingService } from '../../services/booking';
import { BookingFormService } from '../../services/booking-form';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.html',
  styleUrl: './booking-create.css',
  imports: [
    AutoCompleteModule,
    ButtonModule,
    Card,
    CheckboxModule,
    CurrencyPipe,
    DatePickerModule,
    InputMaskModule,
    InputNumberModule,
    InputTextModule,
    PixProofUpload,
    ReactiveFormsModule,
  ],
  providers: [BookingFormService],
})
export class BookingCreate {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  protected readonly bookingFormService = inject(BookingFormService);
  readonly bookingForm = this.bookingFormService.form;

  protected readonly tourSuggestions = signal<TourOption[]>([]);
  protected readonly selectedTour = signal<TourOption | null>(null);
  protected readonly minimumScheduleDate = new Date();
  protected readonly pixProofUploading = signal(false);
  protected readonly bookingSubmitting = signal(false);
  protected readonly bookingSubmitErrors = signal<string[]>([]);
  protected readonly bookingErrorTraceId = signal<string | null>(null);

  private readonly members = toSignal(this.bookingForm.controls.members.valueChanges, {
    initialValue: this.bookingForm.controls.members.getRawValue(),
  });
  private readonly pickupFee = toSignal(
    this.bookingForm.controls.pickup.controls.appliedPickupFee.valueChanges,
    { initialValue: this.bookingForm.controls.pickup.controls.appliedPickupFee.value },
  );
  private readonly manualDiscount = toSignal(
    this.bookingForm.controls.manualDiscount.valueChanges,
    { initialValue: this.bookingForm.controls.manualDiscount.value },
  );

  protected readonly adultCount = computed(
    () => 1 + this.members().filter((member) => member.name?.trim() && !member.isLapChild).length,
  );
  protected readonly lapChildCount = computed(
    () => this.members().filter((member) => member.name?.trim() && member.isLapChild).length,
  );
  protected readonly adultSubtotal = computed(() =>
    fromCents(toCents(this.selectedTour()?.effectivePrice) * this.adultCount()),
  );
  protected readonly pickupFeeAmount = computed(() => fromCents(toCents(this.pickupFee())));

  protected readonly manualDiscountAmount = computed(() =>
    fromCents(toCents(this.manualDiscount())),
  );
  protected readonly total = computed(() => {
    const subtotalInCents = toCents(this.selectedTour()?.effectivePrice) * this.adultCount();
    const totalInCents =
      subtotalInCents + toCents(this.pickupFee()) - toCents(this.manualDiscount());

    return fromCents(Math.max(0, totalInCents));
  });

  protected searchTours(event: { query: string }): void {
    this.bookingService.searchTours(event.query).subscribe({
      next: (result) => {
        this.tourSuggestions.set(
          result.content.map((tour) => ({ ...tour, disabled: !tour.available })),
        );
      },
      error: () => this.tourSuggestions.set([]),
    });
  }

  protected selectTour(event: AutoCompleteSelectEvent): void {
    this.selectedTour.set(event.value as TourOption);
  }

  protected clearTour(): void {
    this.selectedTour.set(null);
  }

  protected onSubmit(): void {
    if (this.pixProofUploading() || this.bookingSubmitting()) {
      return;
    }

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.bookingSubmitting.set(true);
    this.bookingSubmitErrors.set([]);
    this.bookingErrorTraceId.set(null);

    this.bookingService
      .createBooking(this.bookingFormService.buildRequest())
      .pipe(finalize(() => this.bookingSubmitting.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/reservas']),
        error: (error: unknown) => this.handleBookingError(error),
      });
  }

  private handleBookingError(error: unknown): void {
    const fallbackMessage = 'Não foi possível criar a reserva. Tente novamente.';

    if (!(error instanceof HttpErrorResponse)) {
      this.bookingSubmitErrors.set([fallbackMessage]);
      return;
    }

    const payload: unknown = error.error;
    if (this.isValidationError(payload)) {
      const messages = [...new Set(Object.values(payload.errors).filter(Boolean))];

      this.bookingSubmitErrors.set(messages.length ? messages : [fallbackMessage]);
      this.bookingErrorTraceId.set(payload.traceId);
      return;
    }

    if (this.hasMessage(payload)) {
      this.bookingSubmitErrors.set([payload.message]);
      return;
    }

    this.bookingSubmitErrors.set([fallbackMessage]);
  }

  private isValidationError(payload: unknown): payload is ValidationError {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const candidate = payload as Partial<ValidationError>;
    return (
      !!candidate.errors &&
      typeof candidate.errors === 'object' &&
      typeof candidate.traceId === 'string'
    );
  }

  private hasMessage(payload: unknown): payload is { message: string } {
    return (
      !!payload &&
      typeof payload === 'object' &&
      'message' in payload &&
      typeof payload.message === 'string'
    );
  }
}
