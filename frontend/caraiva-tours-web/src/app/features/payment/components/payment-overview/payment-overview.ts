import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { SkeletonModule } from 'primeng/skeleton';

import { PaymentOverview as PaymentOverviewModel } from '../../models/payment.model';

@Component({
  selector: 'app-payment-overview',
  imports: [CurrencyPipe, PIcon, SkeletonModule],
  templateUrl: './payment-overview.html',
  styleUrl: './payment-overview.css',
})
export class PaymentOverview {
  readonly overview = input<PaymentOverviewModel | null>(null);
  readonly loading = input(false);
  readonly failed = input(false);
}
