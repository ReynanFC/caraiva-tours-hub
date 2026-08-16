import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  input,
  LOCALE_ID,
  inject,
  viewChild,
} from '@angular/core';
import {
  Chart,
  ChartData,
  ChartOptions,
  registerables,
  TooltipItem,
} from 'chart.js';

import { Card } from '../../../../shared/components/card/card';
import { WeeklyRevenue } from '../../models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-weekly-revenue-chart',
  imports: [Card],
  templateUrl: './weekly-revenue-chart.html',
  styleUrl: './weekly-revenue-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyRevenueChart {
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart<'line', number[], string> | undefined;
  private readonly destroyRef = inject(DestroyRef);
  private readonly locale = inject(LOCALE_ID);
  private readonly currency = new Intl.NumberFormat(this.locale, {
    style: 'currency',
    currency: 'BRL',
  });
  private readonly dayLabel = new Intl.DateTimeFormat(this.locale, {
    weekday: 'short',
    day: '2-digit',
  });

  readonly revenue = input.required<WeeklyRevenue[]>();

  protected readonly sortedRevenue = computed(() =>
    [...this.revenue()].sort((first, second) => first.day.localeCompare(second.day)),
  );
  protected readonly hasData = computed(() =>
    this.sortedRevenue().some((item) => item.revenue > 0),
  );
  protected readonly chartData = computed<ChartData<'line', number[], string>>(() => ({
    labels: this.sortedRevenue().map((item) => this.formatDay(item.day)),
    datasets: [
      {
        label: 'Faturamento',
        data: this.sortedRevenue().map((item) => item.revenue),
        borderColor: '#e63946',
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        pointBackgroundColor: '#e63946',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 5,
        borderWidth: 2,
        fill: true,
        tension: 0.32,
      },
    ],
  }));

  protected readonly chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<'line'>) => this.currency.format(context.parsed.y ?? 0),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(229, 232, 236, 0.75)' },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
          callback: (value) => this.compactCurrency(Number(value)),
        },
      },
    },
  };

  protected readonly accessibleSummary = computed(() =>
    this.sortedRevenue()
      .map((item) => `${this.formatDay(item.day)}: ${this.currency.format(item.revenue)}`)
      .join('; '),
  );

  constructor() {
    effect(() => {
      const context = this.canvas()?.nativeElement.getContext('2d');
      const data = this.chartData();

      if (!context) return;

      if (this.chart) {
        this.chart.data = data;
        this.chart.update();
        return;
      }

      this.chart = new Chart(context, { type: 'line', data, options: this.chartOptions });
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private formatDay(day: string): string {
    const [year, month, date] = day.split('-').map(Number);
    return this.dayLabel.format(new Date(year, month - 1, date)).replace('.', '');
  }

  private compactCurrency(value: number): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
}
