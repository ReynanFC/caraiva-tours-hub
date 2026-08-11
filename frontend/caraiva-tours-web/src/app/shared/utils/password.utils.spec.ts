import { passwordMeetsRequirements } from './password.utils';

describe('password requirements', () => {
  it('should accept a password that meets every requirement', () => {
    expect(passwordMeetsRequirements('Porto@Caraiva1')).toBe(true);
  });

  it('should reject short or incomplete passwords', () => {
    expect(passwordMeetsRequirements('Porto@1')).toBe(false);
    expect(passwordMeetsRequirements('portocaraiva@1')).toBe(false);
    expect(passwordMeetsRequirements('PortoCaraiva12')).toBe(false);
  });
});
