import { Service } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { formatLocalDateTime } from '../../../shared/utils/date.utils';
import { formatBrazilianPhone } from '../../../shared/utils/phone.utils';
import { CreateBookingRequest } from '../models/booking.model';

type MemberForm = FormGroup<{
  name: FormControl<string>;
  isLapChild: FormControl<boolean>;
}>;

@Service()
export class BookingFormService {
  readonly form = new FormGroup({
    client: new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      email: new FormControl('', {
        nonNullable: false,
        validators: [Validators.email, Validators.maxLength(100)],
      }),
    }),
    members: new FormArray<MemberForm>([]),
    tourId: new FormControl<number | null>(null, Validators.required),
    scheduleDate: new FormControl<Date | null>(null, Validators.required),
    manualDiscount: new FormControl<number | null>(null, Validators.min(0)),
    pixPaymentUrl: new FormControl<string | null>(null),
    pickup: new FormGroup({
      cep: new FormControl('', {
        nonNullable: false,
        validators: [Validators.pattern(/^\d{9}$/)],
      }),
      locationName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      referencePoint: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      appliedPickupFee: new FormControl(0, {
        nonNullable: false,
        validators: [Validators.min(0)],
      }),
    }),
  });

  addMember(): void {
    this.form.controls.members.push(this.createMemberForm());
  }

  removeMember(index: number): void {
    this.form.controls.members.removeAt(index);
  }

  buildRequest(): CreateBookingRequest {
    const { scheduleDate, tourId, ...formValue } = this.form.getRawValue();

    return {
      ...formValue,
      client: {
        ...formValue.client,
        phone: formatBrazilianPhone(formValue.client.phone),
      },
      tourId: tourId!,
      scheduleDate: formatLocalDateTime(scheduleDate!),
    };
  }

  private createMemberForm(): MemberForm {
    return new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      isLapChild: new FormControl(false, { nonNullable: true }),
    });
  }
}
