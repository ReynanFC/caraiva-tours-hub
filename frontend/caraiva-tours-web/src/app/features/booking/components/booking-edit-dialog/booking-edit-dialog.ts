import { Component, effect, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { PixProofUpload } from '../pix-proof-upload/pix-proof-upload';
import {
  BookingDetails,
  BookingMember,
  BookingSummary,
  UpdateBookingRequest,
} from '../../models/booking.model';
import { TourSummary } from '../../models/tour.model';

@Component({
  selector: 'app-booking-edit-dialog',
  imports: [
    ButtonModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    PIcon,
    PixProofUpload,
    SelectModule,
  ],
  templateUrl: './booking-edit-dialog.html',
  styleUrl: './booking-edit-dialog.css',
})
export class BookingEditDialog {
  private readonly dialogRef = inject(DynamicDialogRef);

  readonly booking = input.required<BookingSummary>();
  readonly details = input.required<BookingDetails>();
  readonly tours = input.required<TourSummary[]>();
  readonly onSave = input.required<(request: UpdateBookingRequest) => void>();

  protected clientName = '';
  protected clientPhone = '';
  protected tourId: number | null = null;
  protected scheduleDate = '';
  protected members: BookingMember[] = [];
  protected manualDiscount: number | null = null;
  protected pixUrl: string | null = null;
  protected pixUploading = false;

  constructor() {
    effect(() => {
      const booking = this.booking();
      this.clientName = booking.clientName;
      this.tourId = this.tours().find((tour) => tour.name === booking.tourName)?.id ?? null;
      this.scheduleDate = booking.date.slice(0, 16);
      this.members = this.details().members.map((member) => ({ ...member }));
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
      })
    );
  }

  protected save(): void {
    if (!this.canSave()) return;

    const request: UpdateBookingRequest = {
      clientName: this.clientName.trim() || null,
      clientPhone: this.clientPhone.trim() || null,
      tourId: this.tourId,
      scheduleDate: this.scheduleDate || null,
      members: this.members.map((member) => ({ ...member, name: member.name.trim() })),
      manualDiscount: this.manualDiscount,
      pixUrl: this.pixUrl,
    };

    this.onSave()(request);
    this.dialogRef.close();
  }
}
