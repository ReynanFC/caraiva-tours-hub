import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import { Imgbb } from '../../../../shared/services/imgbb';
import { BookingEditDialog } from './booking-edit-dialog';

describe('BookingEditDialog', () => {
  let fixture: ComponentFixture<BookingEditDialog>;
  const onSave = vi.fn();
  const close = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [BookingEditDialog],
      providers: [
        { provide: DynamicDialogRef, useValue: { close } },
        { provide: Imgbb, useValue: { uploadImage: vi.fn(() => of(null)) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingEditDialog);
    fixture.componentRef.setInput('booking', {
      id: 42,
      attendantId: 7,
      clientName: 'Ana Silva',
      tourName: 'Corumbau',
      date: '2099-08-10T09:30:00',
      groupSize: 2,
      totalPrice: 450,
      status: 'CONFIRMED',
    });
    fixture.componentRef.setInput('details', {
      members: [{ name: 'João Silva', isLapChild: false }],
      commissionEarned: 45,
      history: [],
    });
    fixture.componentRef.setInput('tours', [
      {
        id: 3,
        name: 'Corumbau',
        basePricePerPerson: 225,
        promoPricePerPerson: null,
        isPromotional: false,
        effectivePrice: 225,
        available: true,
        category: { id: 1, name: 'Praia' },
      },
    ]);
    fixture.componentRef.setInput('onSave', onSave);
    fixture.detectChanges();
  });

  it('should edit real members instead of converting a pax count', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Pax');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Integrantes');

    (fixture.componentInstance as any).save();

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        members: [{ name: 'João Silva', isLapChild: false }],
      }),
    );
  });

  it('should reject a schedule date that is not in the future', () => {
    (fixture.componentInstance as any).scheduleDate = '2020-01-01T09:00';

    (fixture.componentInstance as any).save();

    expect(onSave).not.toHaveBeenCalled();
  });
});
