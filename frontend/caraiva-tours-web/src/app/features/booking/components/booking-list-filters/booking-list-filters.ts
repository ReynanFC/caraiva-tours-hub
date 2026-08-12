import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { Input } from '../../../../shared/components/input/input';
import { BookingStatusFilter } from '../../models/booking.model';

@Component({
  selector: 'app-booking-list-filters',
  imports: [ButtonModule, FormsModule, Input],
  templateUrl: './booking-list-filters.html',
  styleUrl: './booking-list-filters.css',
})
export class BookingListFilters {
  readonly selectedStatus = model.required<BookingStatusFilter>();
  readonly search = model.required<string>();

  protected readonly mainStateOptions: { label: string; value: BookingStatusFilter }[] = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Aguardando comprovante', value: 'DRAFT' },
    { label: 'Passeio confirmado', value: 'CONFIRMED' },
    { label: 'Passeio concluído', value: 'COMPLETED' },
  ];

  protected readonly cancellationStateOptions: {
    label: string;
    value: BookingStatusFilter;
  }[] = [
    { label: 'Cancelamento em análise', value: 'CANCEL_REQUEST' },
    { label: 'Cancelamento concluído', value: 'CANCELLED' },
  ];
}
