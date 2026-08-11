export interface TourCategory {
  id: number;
  name: string;
}

export interface TourSummary {
  id: number;
  name: string;
  basePricePerPerson: number;
  promoPricePerPerson: number | null;
  isPromotional: boolean;
  effectivePrice: number;
  available: boolean;
  category: TourCategory;
}

export type TourApiResponse = Omit<TourSummary, 'effectivePrice'>;

export interface TourOption extends TourSummary {
  disabled: boolean;
}
