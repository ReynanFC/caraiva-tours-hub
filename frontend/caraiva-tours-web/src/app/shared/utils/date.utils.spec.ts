import { formatLocalDateTime } from './date.utils';

describe('formatLocalDateTime', () => {
  it('should serialize a date without converting it to UTC', () => {
    const date = new Date(2026, 7, 5, 9, 7, 42);

    expect(formatLocalDateTime(date)).toBe('2026-08-05T09:07:00');
  });
});
