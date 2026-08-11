import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Input } from '../../../../shared/components/input/input';

@Component({
  selector: 'app-user-list-filter',
  imports: [FormsModule, Input],
  template: `<app-input
    icon="search"
    placeholder="Buscar por nome ou e-mail..."
    [(ngModel)]="search"
  />`,
  styles: `
    :host {
      display: block;
      max-width: 24rem;
    }
  `,
})
export class UserListFilter {
  readonly search = model.required<string>();
}
