import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSummary } from '../../models/booking.model';
import { BookingListTable } from './booking-list-table';

describe('BookingListTable', () => {
  let fixture: ComponentFixture<BookingListTable>;

  const booking: BookingSummary = {
    id: 42,
    attendantId: 7,
    clientName: 'Ana Silva',
    tourName: 'Passeio para Corumbau',
    date: '2026-08-10T09:30:00',
    groupSize: 3,
    totalPrice: 450,
    status: 'CONFIRMED',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BookingListTable] }).compileComponents();

    fixture = TestBed.createComponent(BookingListTable);
    fixture.componentRef.setInput('bookings', [booking]);
    fixture.componentRef.setInput('loading', false);
  });

  it('should show edit actions to the employee who owns the booking', () => {
    fixture.componentRef.setInput('isAdmin', false);
    fixture.componentRef.setInput('currentUserId', 7);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[aria-label="Editar reserva"]')).toHaveLength(2);
  });

  it('should hide edit actions from an employee who does not own the booking', () => {
    fixture.componentRef.setInput('isAdmin', false);
    fixture.componentRef.setInput('currentUserId', 8);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[aria-label="Editar reserva"]')).toHaveLength(0);
  });

  it('should show edit actions to an administrator for another employee booking', () => {
    fixture.componentRef.setInput('isAdmin', true);
    fixture.componentRef.setInput('currentUserId', 8);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[aria-label="Editar reserva"]')).toHaveLength(2);
  });

  it('should hide edit actions when the booking is completed', () => {
    fixture.componentRef.setInput('bookings', [{ ...booking, status: 'COMPLETED' }]);
    fixture.componentRef.setInput('isAdmin', true);
    fixture.componentRef.setInput('currentUserId', 7);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[aria-label="Editar reserva"]')).toHaveLength(0);
  });

  it.each(['CONFIRMED', 'COMPLETED'] as const)(
    'should show report actions when the booking is %s',
    (status) => {
      fixture.componentRef.setInput('bookings', [{ ...booking, status }]);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelectorAll('[aria-label="Abrir recibo PDF"]'),
      ).toHaveLength(2);
    },
  );

  it('should hide report actions for other booking statuses', () => {
    fixture.componentRef.setInput('bookings', [{ ...booking, status: 'DRAFT' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[aria-label="Abrir recibo PDF"]')).toHaveLength(
      0,
    );
  });
});
