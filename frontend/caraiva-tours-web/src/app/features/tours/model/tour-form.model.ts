import { Tour, TourRequest } from './tour.model';

export interface TourDurationForm {
  hours: number;
  minutes: number;
}

export interface TourFormModel extends Omit<TourRequest, 'duration'> {
  duration: TourDurationForm;
}

export function emptyTourForm(): TourFormModel {
  return {
    name: '',
    description: '',
    basePricePerPerson: 0,
    promoPricePerPerson: 0,
    commissionType: 'PERCENTAGE',
    commissionValue: 0,
    duration: { hours: 4, minutes: 0 },
    available: true,
    imageUrl: '',
    isPromotional: false,
    categoryTourId: 0,
  };
}

export function tourToForm(tour: Tour): TourFormModel {
  return {
    name: tour.name,
    description: tour.description,
    basePricePerPerson: tour.basePricePerPerson,
    promoPricePerPerson: tour.promoPricePerPerson,
    commissionType: tour.commissionType,
    commissionValue: tour.commissionValue,
    duration: isoDurationToForm(tour.duration),
    available: tour.available,
    imageUrl: tour.imageUrl,
    isPromotional: tour.isPromotional,
    categoryTourId: tour.category.id,
  };
}

export function tourFormToRequest(form: TourFormModel): TourRequest | null {
  const totalMinutes = form.duration.hours * 60 + form.duration.minutes;
  if (totalMinutes <= 0) return null;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    ...form,
    duration: `PT${hours ? `${hours}H` : ''}${minutes ? `${minutes}M` : ''}`,
  };
}

function isoDurationToForm(value: string): TourDurationForm {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?$/i.exec(value);
  return {
    hours: Number(match?.[1] ?? 0),
    minutes: Number(match?.[2] ?? 0),
  };
}
