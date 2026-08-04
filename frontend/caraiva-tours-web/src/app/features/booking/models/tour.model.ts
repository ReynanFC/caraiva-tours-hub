export interface TourCategory {
  id: number;
  name: string;
}

export interface TourSummary {
  id: number;
  name: string;
  effectivePrice: number;
  available: boolean;
  category: TourCategory;
}

export interface TourOption extends TourSummary {
  disabled: boolean;
}
