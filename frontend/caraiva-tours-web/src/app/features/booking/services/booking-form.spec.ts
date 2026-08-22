import { BookingFormService } from './booking-form';

describe('BookingFormService', () => {
  it('should accept an unmasked Brazilian ZIP code with 8 digits', () => {
    const cep = new BookingFormService().form.controls.pickup.controls.cep;

    cep.setValue('45810000');

    expect(cep.valid).toBe(true);
  });

  it('should accept ZIP codes up to 9 characters and reject longer values', () => {
    const cep = new BookingFormService().form.controls.pickup.controls.cep;

    cep.setValue('4581000');
    expect(cep.valid).toBe(true);

    cep.setValue('458100000');
    expect(cep.valid).toBe(true);

    cep.setValue('4581000000');
    expect(cep.hasError('maxlength')).toBe(true);
  });
});
