import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { SkeletonModule } from 'primeng/skeleton';

import { Card } from '../../../../shared/components/card/card';
import { DashboardMetric } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-metric-card',
  imports: [Card, CurrencyPipe, DecimalPipe, PIcon, SkeletonModule],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCard {
  readonly metric = input.required<DashboardMetric>();
  readonly loading = input(false);
}
