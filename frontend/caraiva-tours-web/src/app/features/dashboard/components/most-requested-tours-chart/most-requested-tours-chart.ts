import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { ChartModule } from 'primeng/chart';

import { Card } from '../../../../shared/components/card/card';
import { MostRequestedTour } from '../../models/dashboard.model';

@Component({
  selector: 'app-most-requested-tours-chart',
  imports: [Card, ChartModule],
  templateUrl: './most-requested-tours-chart.html',
  styleUrl: './most-requested-tours-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MostRequestedToursChart {
  readonly tours = input.required<MostRequestedTour[]>();

  protected readonly orderedTours = computed(() =>
    [...this.tours()].sort((first, second) => second.bookingCount - first.bookingCount),
  );
  protected readonly chartData = computed<ChartData<'bar', number[], string>>(() => ({
    labels: this.orderedTours().map((tour) => tour.tourName),
    datasets: [
      {
        label: 'Reservas',
        data: this.orderedTours().map((tour) => tour.bookingCount),
        backgroundColor: '#e63946',
        hoverBackgroundColor: '#d62839',
        borderRadius: 7,
        borderSkipped: false,
        barThickness: 18,
      },
    ],
  }));

  protected readonly chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const tour = this.orderedTours()[context.dataIndex];
            const bookings =
              tour.bookingCount === 1 ? '1 reserva' : `${tour.bookingCount} reservas`;
            return `${bookings} · ${this.formatPercentage(tour.percentage)}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(229, 232, 236, 0.75)' },
        ticks: { color: '#6b7280', precision: 0, font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#374151',
          font: { size: 11 },
          autoSkip: false,
          callback: (_value, index) => this.truncate(this.orderedTours()[index]?.tourName ?? ''),
        },
      },
    },
  };

  protected formatPercentage(percentage: number): string {
    return `${percentage.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
  }

  private truncate(value: string): string {
    return value.length > 24 ? `${value.slice(0, 22)}…` : value;
  }
}
