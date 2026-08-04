import { Component, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card',
  imports: [CardModule, PIcon],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  readonly heading = input<string>(undefined, { alias: 'header' });
  readonly icon = input<string>();
}
