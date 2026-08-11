import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BookingService } from '../../services/booking';
import { BookingList } from './booking-list';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';

describe('BookingList', () => {
  let fixture: ComponentFixture<BookingList>;
  const bookingServiceMock = {
    getBookings: vi.fn(),
    getBookingsDetails: vi.fn(),
    confirmBooking: vi.fn(),
  };

  beforeEach(async () => {
    bookingServiceMock.getBookings.mockReturnValue(
      of({
        content: [
          {
            id: 42,
            attendantId: 7,
            clientName: 'Ana Silva',
            tourName: 'Passeio para Corumbau',
            date: '2026-08-10T09:30:00',
            groupSize: 3,
            totalPrice: 450,
            status: 'CONFIRMED' as const,
          },
        ],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      }),
    );

    await TestBed.configureTestingModule({
      imports: [BookingList],
      providers: [{ provide: BookingService, useValue: bookingServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingList);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the API summary in the matching columns', () => {
    const tableText = (fixture.nativeElement as HTMLElement).querySelector('tbody')?.textContent;

    expect(tableText).toContain('#42');
    expect(tableText).toContain('Ana Silva');
    expect(tableText).toContain('Passeio para Corumbau');
    expect(tableText).toContain('10/08/2026');
    expect(tableText).toContain('09:30');
    expect(tableText).toContain('3');
    expect(tableText).toContain('R$');
    expect(tableText).toMatch(/450[,.]00/);
    expect(tableText).toContain('Confirmado');
  });

  it('should apply the status-specific appearance', () => {
    const badge = (fixture.nativeElement as HTMLElement).querySelector('.status-badge');

    expect(badge?.classList.contains('status-confirmed')).toBe(true);
  });

  it('should show a small notification after completing a tour', async () => {
    const booking = {
      id: 42,
      attendantId: 7,
      clientName: 'Ana Silva',
      tourName: 'Passeio para Corumbau',
      date: '2026-08-10T09:30:00',
      groupSize: 3,
      totalPrice: 450,
      status: 'CONFIRMED' as const,
    };
    bookingServiceMock.confirmBooking.mockReturnValue(of({ ...booking, status: 'COMPLETED' }));
    const notifications = TestBed.inject(ActionNotificationService);
    const addMessage = vi.spyOn(notifications.messages, 'add');

    await (fixture.componentInstance as any).confirmBooking(booking);

    expect(addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'action-notifications',
        severity: 'success',
        detail: 'Passeio da reserva #42 concluído com sucesso.',
        life: 2_000,
        closable: false,
      }),
    );
  });

  it('should show action errors in a temporary notification', async () => {
    const booking = {
      id: 42,
      attendantId: 7,
      clientName: 'Ana Silva',
      tourName: 'Passeio para Corumbau',
      date: '2026-08-10T09:30:00',
      groupSize: 3,
      totalPrice: 450,
      status: 'CONFIRMED' as const,
    };
    bookingServiceMock.getBookingsDetails.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 403,
            error: { message: 'Você não tem permissão para acessar esta reserva.' },
          }),
      ),
    );
    const notifications = TestBed.inject(ActionNotificationService);
    const addMessage = vi.spyOn(notifications.messages, 'add');

    await (fixture.componentInstance as any).openBookingDetails(booking);

    expect(addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        detail: 'Você não tem permissão para acessar esta reserva.',
        life: 2_000,
        closable: false,
      }),
    );
  });
});
