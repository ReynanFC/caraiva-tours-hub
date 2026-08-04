import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

import { Card } from '../../../../shared/components/card/card';
import { TourOption } from '../../models/tour.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.html',
  styleUrl: './booking-create.css',
  imports: [
    AutoCompleteModule,
    ButtonModule,
    Card,
    CurrencyPipe,
    DatePickerModule,
    InputMaskModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
})
export class BookingCreate {
  private readonly bookingService = inject(BookingService);

  protected readonly tourSuggestions = signal<TourOption[]>([]);
  protected readonly minimumScheduleDate = new Date();

  readonly bookingForm = new FormGroup({
    client: new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{11}$/)],
      }),
      email: new FormControl('', {
        nonNullable: false,
        validators: [Validators.email, Validators.maxLength(100)],
      }),
    }),
    tourId: new FormControl<number | null>(null, Validators.required),
    scheduleDate: new FormControl<Date | null>(null, Validators.required),
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

  protected onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
    }
  }

  protected buildBookingRequestValue() {
    const { scheduleDate, ...formValue } = this.bookingForm.getRawValue();

    return {
      ...formValue,
      scheduleDate: scheduleDate ? this.formatLocalDateTime(scheduleDate) : null,
    };
  }

  private formatLocalDateTime(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');

    return [
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      `${pad(date.getHours())}:${pad(date.getMinutes())}:00`,
    ].join('T');
  }
}
