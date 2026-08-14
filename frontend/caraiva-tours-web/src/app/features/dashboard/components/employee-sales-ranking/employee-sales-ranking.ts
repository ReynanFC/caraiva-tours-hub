import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Card } from '../../../../shared/components/card/card';
import { EmployeeSalesRanking as EmployeeSalesRankingItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-employee-sales-ranking',
  imports: [Card, CurrencyPipe],
  templateUrl: './employee-sales-ranking.html',
  styleUrl: './employee-sales-ranking.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeSalesRanking {
  readonly employees = input.required<EmployeeSalesRankingItem[]>();
}
