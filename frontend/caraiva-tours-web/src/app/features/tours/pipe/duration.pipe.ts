import { Pipe, PipeTransform } from '@angular/core';

export function durationToDisplay(value: string): string {
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/i.exec(value.trim());
  if (!match) return value;

  const [, days, hours, minutes] = match;
  return (
    [days && `${days}d`, hours && `${hours}h`, minutes && `${minutes}min`]
      .filter(Boolean)
      .join(' ') || '0min'
  );
}

export function durationInputToIso(value: string): string | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (/^p/i.test(normalized))
    return /^p(?:\d+d)?(?:t(?:\d+h)?(?:\d+m)?)?$/i.test(normalized)
      ? normalized.toUpperCase()
      : null;

  const clock = /^(\d{1,3}):([0-5]\d)$/.exec(normalized);
  if (clock) return toIso(Number(clock[1]), Number(clock[2]));

  const hoursAndMinutes = /^(\d+)\s*h(?:\s*(\d+)\s*(?:m|min)?)?$/.exec(normalized);
  if (hoursAndMinutes) {
    return toIso(Number(hoursAndMinutes[1]), Number(hoursAndMinutes[2] ?? 0));
  }

  const minutesOnly = /^(\d+)\s*(?:m|min)$/.exec(normalized);
  if (minutesOnly) return toIso(0, Number(minutesOnly[1]));

  if (/^\d+$/.test(normalized)) return toIso(Number(normalized), 0);
  return null;
}

function toIso(hours: number, minutes: number): string | null {
  const totalMinutes = hours * 60 + minutes;
  if (totalMinutes <= 0) return null;
  const normalizedHours = Math.floor(totalMinutes / 60);
  const normalizedMinutes = totalMinutes % 60;
  return `PT${normalizedHours ? `${normalizedHours}H` : ''}${normalizedMinutes ? `${normalizedMinutes}M` : ''}`;
}

@Pipe({ name: 'tourDuration' })
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    return durationToDisplay(value);
  }
}
