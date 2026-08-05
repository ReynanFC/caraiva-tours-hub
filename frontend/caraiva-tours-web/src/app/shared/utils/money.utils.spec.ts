import { fromCents, toCents } from './money.utils';

describe('money utils', () => {
  it('should convert decimal values to integer cents without floating-point drift', () => {
    expect(toCents(10.075)).toBe(1008);
    expect(toCents(0.1 + 0.2)).toBe(30);
  });

  it('should convert cents back to a currency amount', () => {
    expect(fromCents(20_005)).toBe(200.05);
  });
});
