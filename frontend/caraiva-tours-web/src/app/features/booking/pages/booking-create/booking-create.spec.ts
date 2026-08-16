import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { BookingSummary } from '../../models/booking.model';
import { ImgBbResponse } from '../../../../shared/models/img-bb-response';
import { TourOption } from '../../models/tour.model';
import { BookingService } from '../../services/booking';
import { Imgbb } from '../../../../shared/services/imgbb';
import { BookingCreate } from './booking-create';

describe('BookingCreate', () => {
  let fixture: ComponentFixture<BookingCreate>;
  const imgbbMock = {
    uploadImage: vi.fn(),
  };
  const bookingServiceMock = {
    createBooking: vi.fn(),
    searchTours: vi.fn(),
  };
  const routerMock = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    imgbbMock.uploadImage.mockReset();
    bookingServiceMock.createBooking.mockReset();
    bookingServiceMock.searchTours.mockReset();
    routerMock.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [BookingCreate],
      providers: [
        { provide: BookingService, useValue: bookingServiceMock },
        { provide: Imgbb, useValue: imgbbMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingCreate);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add a new member row', () => {
    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('.add-member-button');

    addButton.click();
    fixture.detectChanges();

    const memberRows = fixture.nativeElement.querySelectorAll('.member-row');
    expect(memberRows).toHaveLength(1);
  });

  it('should allow a booking without additional members', () => {
    expect(fixture.componentInstance.bookingForm.controls.members).toHaveLength(0);

    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('.add-member-button');
    addButton.click();
    fixture.detectChanges();
    const removeButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.remove-member-button');
    removeButton.click();

    expect(fixture.componentInstance.bookingForm.controls.members).toHaveLength(0);
  });

  it('should configure the phone mask and maximum length', () => {
    const phoneInput: HTMLInputElement = fixture.nativeElement.querySelector('#phone');

    expect(phoneInput.maxLength).toBe(20);
    expect(phoneInput.placeholder).toBe('(00) 00000-0000');
  });

  it('should upload a Pix proof only when submitting the booking', async () => {
    const imageUrl = 'https://i.ibb.co/example/pix-proof.png';
    imgbbMock.uploadImage.mockReturnValue(
      of({ success: true, data: { url: imageUrl } } as ImgBbResponse),
    );
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#pixProof');
    const file = new File(['pix'], 'comprovante.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { configurable: true, value: [file] });

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(imgbbMock.uploadImage).not.toHaveBeenCalled();
    expect(fixture.componentInstance.bookingForm.controls.pixPaymentUrl.value).toBeNull();
    expect(fixture.nativeElement.querySelector('.status-ready')).toBeTruthy();

    const component = fixture.componentInstance;
    component.bookingForm.patchValue({
      client: { name: 'Maria Souza', phone: '73999999999' },
      tourId: 1,
      scheduleDate: new Date(Date.now() + 86_400_000),
      pickup: { locationName: 'Pousada Caraíva', referencePoint: 'Próximo à praça' },
    });
    bookingServiceMock.createBooking.mockReturnValue(of({} as BookingSummary));

    await (component as unknown as { onSubmit(): Promise<void> }).onSubmit();

    expect(imgbbMock.uploadImage).toHaveBeenCalledWith(file);
    expect(component.bookingForm.controls.pixPaymentUrl.value).toBe(imageUrl);
    expect(bookingServiceMock.createBooking).toHaveBeenCalledWith(
      expect.objectContaining({ pixPaymentUrl: imageUrl }),
    );
  });

  it('should send the existing ImgBB URL to the bookings endpoint', async () => {
    const imageUrl = 'https://i.ibb.co/example/pix-proof.png';
    const component = fixture.componentInstance;
    component.bookingForm.patchValue({
      client: {
        name: 'Maria Souza',
        phone: '73999999999',
      },
      tourId: 1,
      scheduleDate: new Date(Date.now() + 86_400_000),
      pixPaymentUrl: imageUrl,
      pickup: {
        locationName: 'Pousada Caraíva',
        referencePoint: 'Próximo à praça',
      },
    });
    bookingServiceMock.createBooking.mockReturnValue(of({} as BookingSummary));

    await (component as unknown as { onSubmit(): Promise<void> }).onSubmit();

    expect(bookingServiceMock.createBooking).toHaveBeenCalledWith(
      expect.objectContaining({ pixPaymentUrl: imageUrl }),
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/reservas']);
  });

  it('should calculate the total in cents and exclude lap children', () => {
    const component = fixture.componentInstance;
    const summary = component as unknown as {
      selectTour(event: { value: TourOption }): void;
      adultCount: () => number;
      lapChildCount: () => number;
      adultSubtotal: () => number;
      total: () => number;
    };
    const tour: TourOption = {
      id: 1,
      name: 'Passeio de barco',
      basePricePerPerson: 120,
      promoPricePerPerson: 99.99,
      isPromotional: true,
      effectivePrice: 99.99,
      available: true,
      disabled: false,
      category: { id: 1, name: 'Barco' },
    };

    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('.add-member-button');
    addButton.click();
    component.bookingForm.controls.members.at(0).patchValue({
      name: 'Adulto adicional',
      isLapChild: false,
    });
    addButton.click();
    component.bookingForm.controls.members.at(1).patchValue({
      name: 'Criança de colo',
      isLapChild: true,
    });
    component.bookingForm.controls.pickup.controls.appliedPickupFee.setValue(0.1);
    component.bookingForm.controls.manualDiscount.setValue(0.03);
    summary.selectTour({ value: tour });

    expect(summary.adultCount()).toBe(2);
    expect(summary.lapChildCount()).toBe(1);
    expect(summary.adultSubtotal()).toBe(199.98);
    expect(summary.total()).toBe(200.05);
  });

  it('should display validation messages and trace ID returned by the backend', async () => {
    const component = fixture.componentInstance;
    const traceId = 'a3f0c8b2-5f84-4aa1-92cb-b6041433e74b';
    component.bookingForm.patchValue({
      client: { name: 'Maria Souza', phone: '(73) 99999-9999' },
      tourId: 1,
      scheduleDate: new Date(Date.now() + 86_400_000),
      pickup: {
        locationName: 'Pousada Caraíva',
        referencePoint: 'Próximo à praça',
      },
    });
    bookingServiceMock.createBooking.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: {
              timestamp: '2026-08-05T15:00:00Z',
              errors: {
                tourId: 'O passeio selecionado não está disponível.',
                scheduleDate: 'A data do passeio deve estar no futuro.',
              },
              path: '/api/bookings',
              traceId,
            },
          }),
      ),
    );

    await (component as unknown as { onSubmit(): Promise<void> }).onSubmit();
    fixture.detectChanges();

    const alert: HTMLElement = fixture.nativeElement.querySelector('.booking-submit-error');
    expect(alert.textContent).toContain('O passeio selecionado não está disponível.');
    expect(alert.textContent).toContain('A data do passeio deve estar no futuro.');
    expect(alert.textContent).toContain(traceId);
  });
});
