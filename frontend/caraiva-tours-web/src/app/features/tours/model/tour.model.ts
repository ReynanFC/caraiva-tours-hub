import { Category } from './category.model';

export interface Tour {
  id: number;
  name: string;
  description: string;
  basePricePerPerson: number;
  promoPricePerPerson: number;
  commissionType: CommissionType;
  commissionValue: number;
  duration: string;
  available: boolean;
  imageUrl: string;
  isPromotional: boolean;
  category: Category;
}

export interface ToggleTourAvailabilityRequest {
  available: boolean;
}

export interface TourRequest {
  name: string;
  description: string;
  basePricePerPerson: number;
  promoPricePerPerson: number;
  commissionType: CommissionType;
  commissionValue: number;
  duration: string;
  available: boolean;
  imageUrl: string;
  isPromotional: boolean;
  categoryTourId: number;
}

export type CommissionType = 'PERCENTAGE' | 'FIXED';
