import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card',
  imports: [CardModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  readonly header = input<string>();
}
