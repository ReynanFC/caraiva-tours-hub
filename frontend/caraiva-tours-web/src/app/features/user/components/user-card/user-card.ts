import { Component, computed, input, output } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';

import { UserSummary } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-card',
  imports: [PIcon],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  readonly user = input.required<UserSummary>();
  readonly currentUserId = input<number | null>(null);
  readonly loading = input(false);
  readonly profileRequested = output<UserSummary>();
  readonly statusToggle = output<UserSummary>();

  protected readonly initials = computed(() => this.user().userName.slice(0, 2).toUpperCase());
  protected readonly roleLabel = computed(() =>
    this.user().role === 'ADMIN' ? 'Administrador' : 'Funcionário',
  );
  protected readonly statusActionBlocked = computed(
    () =>
      this.loading() ||
      (this.user().enabled &&
        (this.user().id === this.currentUserId() || this.user().role === 'ADMIN')),
  );
  protected readonly statusActionTitle = computed(() => {
    if (!this.user().enabled) return 'Ativar usuário';
    if (this.user().id === this.currentUserId()) return 'Você não pode desativar sua própria conta';
    if (this.user().role === 'ADMIN')
      return 'Administradores não podem desativar outro administrador';
    return 'Desativar usuário';
  });

  protected toggleStatus(event: Event): void {
    event.stopPropagation();
    if (this.statusActionBlocked()) return;
    this.statusToggle.emit(this.user());
  }
}
