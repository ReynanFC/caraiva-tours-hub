import { durationInputToIso, durationToDisplay } from './duration.pipe';

describe('tour duration formatting', () => {
  it.each([
    ['4h30', 'PT4H30M'],
    ['90min', 'PT1H30M'],
    ['04:30', 'PT4H30M'],
    ['4', 'PT4H'],
  ])('converts %s to ISO-8601', (input, expected) => {
    expect(durationInputToIso(input)).toBe(expected);
  });

  it('formats ISO-8601 for display', () => {
    expect(durationToDisplay('PT4H30M')).toBe('4h 30min');
  });

  it('rejects an invalid or zero duration', () => {
    expect(durationInputToIso('qualquer coisa')).toBeNull();
    expect(durationInputToIso('0')).toBeNull();
  });
});
