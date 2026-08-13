import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { Input } from '../../../../shared/components/input/input';
import { PaymentView } from '../../models/payment.model';

@Component({
  selector: 'app-payment-filters',
  imports: [ButtonModule, FormsModule, Input],
  templateUrl: './payment-filters.html',
  styleUrl: './payment-filters.css',
})
export class PaymentFilters {
  readonly view = model.required<PaymentView>();
  readonly search = model.required<string>();

  protected readonly views: ReadonlyArray<{
    label: string;
    value: PaymentView;
    countLabel: string;
  }> = [
    { label: 'Pagamentos', value: 'PAYMENTS', countLabel: 'Pagamentos confirmados' },
    { label: 'Pendentes', value: 'DRAFT', countLabel: 'Reservas aguardando comprovante' },
    { label: 'Cancelados', value: 'CANCELLED', countLabel: 'Reservas canceladas' },
  ];

  protected placeholder(): string {
    return this.view() === 'PAYMENTS'
      ? 'Buscar por cliente ou nº do pagamento'
      : 'Buscar por cliente, telefone ou nº da reserva';
  }
}
