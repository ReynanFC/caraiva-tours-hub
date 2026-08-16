import { TestBed } from '@angular/core/testing';

import { TokenStore } from '../../../core/auth/token/token-store';
import { Auth } from '../../../core/service/auth';
import { DashboardStreamEvent } from '../models/dashboard.model';
import { DashboardEventsService } from './dashboard-events.service';

describe('DashboardEventsService', () => {
  const getAccessToken = vi.fn(() => 'access-token');
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    TestBed.configureTestingModule({
      providers: [
        DashboardEventsService,
        { provide: TokenStore, useValue: { getAccessToken } },
        { provide: Auth, useValue: { refreshToken: vi.fn() } },
      ],
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('authenticates the stream and publishes dashboard invalidations', async () => {
    let streamController!: ReadableStreamDefaultController<Uint8Array>;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        streamController = controller;
      },
    });
    fetchMock.mockResolvedValue(new Response(stream, { status: 200 }));

    const events: DashboardStreamEvent[] = [];
    const subscription = TestBed.inject(DashboardEventsService).connect().subscribe((event) => {
      events.push(event);
    });

    streamController.enqueue(
      new TextEncoder().encode(
        'event: dashboard-changed\r\ndata: {"bookingId":42,"reason":"BOOKING_UPDATED","view":"USER","occurredAt":"2026-08-15T12:51:00Z"}\r\n\r\n',
      ),
    );

    await vi.waitFor(() => expect(events).toHaveLength(1));
    expect(events[0]).toEqual({
      type: 'dashboard-changed',
      data: {
        bookingId: 42,
        reason: 'BOOKING_UPDATED',
        view: 'USER',
        occurredAt: '2026-08-15T12:51:00Z',
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/dashboard/events',
      expect.objectContaining({
        headers: {
          Accept: 'text/event-stream',
          Authorization: 'Bearer access-token',
        },
      }),
    );

    subscription.unsubscribe();
  });
});
