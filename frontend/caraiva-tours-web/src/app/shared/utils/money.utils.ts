export function toCents(value: number | null | undefined): number {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  const [coefficient, exponent = '0'] = value.toString().split('e');
  const cents = Math.round(Number(`${coefficient}e${Number(exponent) + 2}`));

  return Math.max(0, cents);
}

export function fromCents(cents: number): number {
  return cents / 100;
}
