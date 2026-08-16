import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { SessionStore } from '../../../../core/auth/session/session-store';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import { UsersService } from '../../../user/services/users';
import { DashboardResponse, DashboardStreamEvent } from '../../models/dashboard.model';
import { DashboardEventsService } from '../../services/dashboard-events.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  const events = new Subject<DashboardStreamEvent>();
  const dashboard = (monthlyRevenue: number): DashboardResponse => ({
    monthlyRevenue,
    todayBookings: 1,
    pendingCommissions: 0,
    confirmationStatus: [],
    weeklyRevenue: [],
    mostRequestedTours: [],
    latestBookings: [],
    employeeMetrics: {
      monthlyCommissionRevenue: 0,
      completedTours: 0,
      pendingDraftBookings: 0,
    },
  });
  const dashboardServiceMock = {
    getDashboard: vi.fn(),
    getAdminDashboard: vi.fn(),
  };

  beforeEach(() => {
    dashboardServiceMock.getDashboard.mockReset().mockReturnValue(of(dashboard(100)));
    dashboardServiceMock.getAdminDashboard.mockReset();

    TestBed.configureTestingModule({
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: DashboardEventsService, useValue: { connect: () => events } },
        {
          provide: SessionStore,
          useValue: { isEmployee: signal(true), isAdmin: signal(false), userId: signal(7) },
        },
        { provide: UsersService, useValue: {} },
        { provide: ActionNotificationService, useValue: {} },
      ],
    });
  });

  it('should update data silently when the server emits an event', async () => {
    const page = TestBed.runInInjectionContext(() => new DashboardPage());
    const resource = (page as any).dashboardResource;

    await vi.waitFor(() => expect(resource.value()?.monthlyRevenue).toBe(100));
    const reload = vi.spyOn(resource, 'reload');
    dashboardServiceMock.getDashboard.mockReturnValue(of(dashboard(250)));

    events.next({
      type: 'dashboard-changed',
      data: {
        bookingId: 42,
        reason: 'BOOKING_UPDATED',
        view: 'USER',
        occurredAt: '2026-08-15T12:51:00Z',
      },
    });

    await vi.waitFor(() => expect(resource.value()?.monthlyRevenue).toBe(250));
    expect(reload).not.toHaveBeenCalled();
    expect(resource.isLoading()).toBe(false);
  });
});
