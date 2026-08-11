import { Component, input, output, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';

import { Tour } from '../../model/tour.model';
import { DurationPipe } from '../../pipe/duration.pipe';

@Component({
  selector: 'app-tour-card-grid',
  imports: [PIcon, DurationPipe],
  templateUrl: './tour-card-grid.html',
  styleUrl: './tour-card-grid.css',
})
export class TourCardGrid {
  readonly tours = input.required<readonly Tour[]>();
  readonly isAdmin = input(false);
  readonly availabilityToggle = output<Tour>();
  readonly edit = output<Tour>();
  readonly remove = output<Tour>();
  protected readonly expandedTourIds = signal<ReadonlySet<number>>(new Set());
  protected readonly currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  protected priceFor = (tour: Tour) =>
    tour.isPromotional && tour.promoPricePerPerson
      ? tour.promoPricePerPerson
      : tour.basePricePerPerson;
  protected commissionFor = (tour: Tour) =>
    tour.commissionType === 'PERCENTAGE'
      ? `${tour.commissionValue}%`
      : this.currency.format(tour.commissionValue);

  protected isExpanded(tourId: number): boolean {
    return this.expandedTourIds().has(tourId);
  }

  protected toggleDetails(tourId: number): void {
    this.expandedTourIds.update((current) => {
      const updated = new Set(current);
      updated.has(tourId) ? updated.delete(tourId) : updated.add(tourId);
      return updated;
    });
  }
}
