import { BookingStatus } from '../../booking/models/booking.model';

export interface DashboardResponse {
  monthlyRevenue: number;
  todayBookings: number;
  pendingCommissions: number;
  confirmationStatus: DashboardStatusAmount[];
  weeklyRevenue: WeeklyRevenue[];
  mostRequestedTours: MostRequestedTour[];
  latestBookings: LatestBooking[];
  employeeMetrics: EmployeeMetrics;
}

export interface DashboardStatusAmount {
  status: BookingStatus;
  amount: number;
}

export interface WeeklyRevenue {
  day: string;
  revenue: number;
}

export interface MostRequestedTour {
  tourId: number;
  tourName: string;
  bookingCount: number;
  percentage: number;
}

export interface LatestBooking {
  id: number;
  clientName: string;
  tourName: string;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: BookingStatus;
}

export interface EmployeeMetrics {
  monthlyCommissionRevenue: number;
  completedTours: number;
  pendingDraftBookings: number;
}

export interface AdminDashboardResponse {
  confirmedRevenue: number;
  receivable: number;
  cancelledOrders: number;
  grossRevenue: number;
  confirmedTourRevenue: ConfirmedTourRevenue[];
  mostRequestedTours: MostRequestedTour[];
  employeeRanking: EmployeeSalesRanking[];
}

export interface EmployeeSalesRanking {
  rankingPosition: number;
  employeeId: number;
  employeeName: string;
  totalSales: number;
  totalCommission: number;
  bookingCount: number;
}

export interface ConfirmedTourRevenue {
  tourId: number;
  tourName: string;
  revenue: number;
}

export interface DashboardMetric {
  label: string;
  value: number;
  description: string;
  icon: string;
  format: 'currency' | 'number';
  tone: DashboardMetricTone;
}

export type DashboardMetricTone = 'primary' | 'success' | 'warning' | 'info' | 'neutral';
