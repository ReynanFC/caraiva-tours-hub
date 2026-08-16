import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import { Imgbb } from '../../../../shared/services/imgbb';
import { BookingEditDialog } from './booking-edit-dialog';

describe('BookingEditDialog', () => {
  let fixture: ComponentFixture<BookingEditDialog>;
  const onSave = vi.fn();
  const close = vi.fn();
  const imgbbMock = { uploadImage: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [BookingEditDialog],
      providers: [
        { provide: DynamicDialogRef, useValue: { close } },
        { provide: Imgbb, useValue: imgbbMock },
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
      pickup: {
        cep: '45810-000',
        locationName: 'Pousada Caraíva',
        referencePoint: 'Próximo à praça',
        appliedPickupFee: 20,
      },
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

  it('should edit real members instead of converting a pax count', async () => {
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Pax');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Integrantes');

    await (fixture.componentInstance as any).save();

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

  it('should initialize and submit the pickup location', async () => {
    expect((fixture.componentInstance as any).pickup.locationName).toBe('Pousada Caraíva');

    (fixture.componentInstance as any).pickup.referencePoint = 'Em frente ao mercado';
    await (fixture.componentInstance as any).save();

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        pickup: {
          cep: '45810-000',
          locationName: 'Pousada Caraíva',
          referencePoint: 'Em frente ao mercado',
          appliedPickupFee: 20,
        },
      }),
    );
  });

  it('should upload a selected image only when saving', async () => {
    const imageUrl = 'https://i.ibb.co/example/pix-proof.png';
    imgbbMock.uploadImage.mockReturnValue(of({ success: true, data: { url: imageUrl } }));
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#pixProof');
    const file = new File(['pix'], 'comprovante.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { configurable: true, value: [file] });

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(imgbbMock.uploadImage).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.status-ready')).toBeTruthy();

    await (fixture.componentInstance as any).save();

    expect(imgbbMock.uploadImage).toHaveBeenCalledWith(file);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ pixPaymentUrl: imageUrl }),
    );
  });

  it('should upload only the last selected image', async () => {
    const imageUrl = 'https://i.ibb.co/example/final-proof.png';
    imgbbMock.uploadImage.mockReturnValue(of({ success: true, data: { url: imageUrl } }));
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#pixProof');
    const discardedFile = new File(['old'], 'comprovante-antigo.png', { type: 'image/png' });
    const finalFile = new File(['new'], 'comprovante-final.png', { type: 'image/png' });

    Object.defineProperty(input, 'files', { configurable: true, value: [discardedFile] });
    input.dispatchEvent(new Event('change'));
    Object.defineProperty(input, 'files', { configurable: true, value: [finalFile] });
    input.dispatchEvent(new Event('change'));

    expect(imgbbMock.uploadImage).not.toHaveBeenCalled();

    await (fixture.componentInstance as any).save();

    expect(imgbbMock.uploadImage).toHaveBeenCalledTimes(1);
    expect(imgbbMock.uploadImage).toHaveBeenCalledWith(finalFile);
  });
});
