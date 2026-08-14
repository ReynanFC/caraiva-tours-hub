import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestBookings } from './latest-bookings';

describe('LatestBookings', () => {
  let fixture: ComponentFixture<LatestBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LatestBookings] }).compileComponents();
    fixture = TestBed.createComponent(LatestBookings);
  });

  it('renders semantic booking data with a friendly status', () => {
    fixture.componentRef.setInput('bookings', [
      {
        id: 42,
        clientName: 'Ana Silva',
        tourName: 'Praia do Espelho',
        date: '2026-08-13T09:30:00',
        groupSize: 3,
        totalPrice: 450,
        status: 'CONFIRMED',
      },
    ]);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('table caption')).not.toBeNull();
    expect(element.textContent).toContain('Ana Silva');
    expect(element.textContent).toContain('Confirmada');
    expect(element.textContent).not.toContain('CONFIRMED');
  });

  it('renders a friendly empty state', () => {
    fixture.componentRef.setInput('bookings', []);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Nenhuma reserva encontrada',
    );
  });
});
