import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStatusBadge } from './booking-status-badge';

describe('BookingStatusBadge', () => {
  let fixture: ComponentFixture<BookingStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BookingStatusBadge] }).compileComponents();
    fixture = TestBed.createComponent(BookingStatusBadge);
  });

  it('renders the friendly status label and matching visual class', () => {
    fixture.componentRef.setInput('status', 'CANCEL_REQUEST');
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector('.status-badge');
    expect(badge?.textContent).toContain('Cancelamento em análise');
    expect(badge?.classList.contains('status-cancel-request')).toBe(true);
  });
});
