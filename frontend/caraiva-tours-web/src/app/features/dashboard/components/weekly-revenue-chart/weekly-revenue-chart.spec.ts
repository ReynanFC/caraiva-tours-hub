import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyRevenueChart } from './weekly-revenue-chart';

describe('WeeklyRevenueChart', () => {
  let fixture: ComponentFixture<WeeklyRevenueChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [WeeklyRevenueChart] }).compileComponents();
    fixture = TestBed.createComponent(WeeklyRevenueChart);
  });

  it('orders revenue chronologically and exposes an accessible summary', () => {
    fixture.componentRef.setInput('revenue', [
      { day: '2026-08-12', revenue: 120 },
      { day: '2026-08-10', revenue: 80 },
    ]);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      chartData: () => { datasets: Array<{ data: number[] }> };
      accessibleSummary: () => string;
    };

    expect(component.chartData().datasets[0].data).toEqual([80, 120]);
    expect(component.accessibleSummary()).toContain('R$');
  });

  it('shows an empty state when the week has no revenue', () => {
    fixture.componentRef.setInput('revenue', [
      { day: '2026-08-10', revenue: 0 },
      { day: '2026-08-11', revenue: 0 },
    ]);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Sem faturamento nesta semana',
    );
    expect((fixture.nativeElement as HTMLElement).querySelector('canvas')).toBeNull();
  });
});
