import { Component, effect, inject, input, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';

import { ImageUpload } from '../../../../shared/components/image-upload/image-upload';
import { Input } from '../../../../shared/components/input/input';
import { formatBrazilianPhone } from '../../../../shared/utils/phone.utils';
import {
  BookingDetails,
  BookingMember,
  BookingSummary,
  UpdateBookingRequest,
} from '../../models/booking.model';
import { TourSummary } from '../../models/tour.model';

@Component({
  selector: 'app-booking-edit-dialog',
  imports: [ButtonModule, CheckboxModule, FormsModule, Input, PIcon, ImageUpload, SelectModule],
  templateUrl: './booking-edit-dialog.html',
  styleUrl: './booking-edit-dialog.css',
})
export class BookingEditDialog {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly pixUpload = viewChild.required(ImageUpload);

  readonly booking = input.required<BookingSummary>();
  readonly details = input.required<BookingDetails>();
  readonly tours = input.required<TourSummary[]>();

  protected clientName = '';
  protected clientPhone = '';
  protected tourId: number | null = null;
  protected scheduleDate = '';
  protected members: BookingMember[] = [];
  protected manualDiscount: number | null = null;
  protected pixUrl: string | null = null;
  protected pixUploading = false;
  protected pickup = {
    cep: null as string | null,
    locationName: '',
    referencePoint: '',
    appliedPickupFee: null as number | null,
  };

  constructor() {
    effect(() => {
      const booking = this.booking();
      this.clientName = booking.clientName;
      this.tourId = this.tours().find((tour) => tour.name === booking.tourName)?.id ?? null;
      this.scheduleDate = booking.date.slice(0, 16);
      this.members = this.details().members.map((member) => ({ ...member }));
      this.pickup = { ...this.details().pickup };
    });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected addMember(): void {
    this.members.push({ name: '', isLapChild: false });
  }

  protected removeMember(index: number): void {
    this.members.splice(index, 1);
  }

  protected scheduleDateIsFuture(): boolean {
    return !this.scheduleDate || new Date(this.scheduleDate).getTime() > Date.now();
  }

  protected canSave(): boolean {
    return (
      !this.pixUploading &&
      this.clientName.length <= 100 &&
      this.clientPhone.length <= 20 &&
      this.scheduleDateIsFuture() &&
      (this.manualDiscount === null || this.manualDiscount >= 0) &&
      this.members.every((member) => {
        const name = member.name.trim();
        return name.length > 0 && name.length <= 100;
      }) &&
      this.pickup.locationName.trim().length > 0 &&
      this.pickup.locationName.length <= 150 &&
      this.pickup.referencePoint.length <= 255 &&
      (this.pickup.appliedPickupFee === null || this.pickup.appliedPickupFee >= 0)
    );
  }

  protected async save(): Promise<void> {
    if (!this.canSave()) return;

    try {
      this.pixUrl = await this.pixUpload().uploadPendingFile();
    } catch {
      return;
    }

    const request: UpdateBookingRequest = {
      clientName: this.clientName.trim() || null,
      clientPhone: this.clientPhone.trim() ? formatBrazilianPhone(this.clientPhone) : null,
      tourId: this.tourId,
      scheduleDate: this.scheduleDate || null,
      members: this.members.map((member) => ({ ...member, name: member.name.trim() })),
      manualDiscount: this.manualDiscount,
      pixPaymentUrl: this.pixUrl,
      pickup: {
        cep: this.pickup.cep?.trim() || null,
        locationName: this.pickup.locationName.trim(),
        referencePoint: this.pickup.referencePoint.trim(),
        appliedPickupFee: this.pickup.appliedPickupFee,
      },
    };

    this.dialogRef.close(request);
  }
}
