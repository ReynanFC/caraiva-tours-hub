import { Component, debounced, inject, resource, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { SessionStore } from '../../../../core/auth/session/session-store';
import { getApiErrorMessage } from '../../../../core/http/api-error';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import { UserProfileDialog } from '../../../../shared/components/user-profile-dialog/user-profile-dialog';
import { UserSummary } from '../../../../shared/models/user.model';
import { UserProfileService } from '../../../../shared/services/user-profile.service';
import { CreateUserRequest } from '../../models/user-admin.model';
import { UsersService } from '../../services/users';
import { UserCard } from '../../components/user-card/user-card';
import { UserCreateDialog } from '../../components/user-create-dialog/user-create-dialog';
import { UserListFilter } from '../../components/user-list-filter/user-list-filter';
import { UserPagination } from '../../components/user-pagination/user-pagination';

@Component({
  selector: 'app-users-list',
  imports: [ButtonModule, PIcon, UserCard, UserCreateDialog, UserListFilter, UserPagination],
  providers: [DialogService],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList {
  private readonly usersService = inject(UsersService);
  private readonly profileService = inject(UserProfileService);
  private readonly sessionStore = inject(SessionStore);
  private readonly notifications = inject(ActionNotificationService);
  private readonly dialogs = inject(DialogService);

  protected readonly isAdmin = this.sessionStore.isAdmin;
  protected readonly currentUserId = () => this.sessionStore.userProfile()?.id ?? null;
  protected readonly search = signal('');
  protected readonly page = signal(0);
  protected readonly pageSize = 9;
  protected readonly createOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly actionLoadingId = signal<number | null>(null);
  private readonly debouncedSearch = debounced(this.search, 600);

  protected readonly usersResource = resource({
    params: () =>
      this.isAdmin() ? { search: this.debouncedSearch.value(), page: this.page() } : undefined,
    loader: ({ params }) =>
      firstValueFrom(this.usersService.getUsers(params.search, params.page, this.pageSize)),
  });

  protected changeSearch(value: string): void {
    this.page.set(0);
    this.search.set(value);
  }

  protected openCreate(): void {
    this.createOpen.set(true);
  }

  protected async createUser(request: CreateUserRequest): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.notifications.clear();
    try {
      await firstValueFrom(this.usersService.createUser(request));
      this.notifications.success(`Usuário “${request.fullName}” criado com sucesso.`);
      this.createOpen.set(false);
      this.usersResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível criar o usuário.'),
      );
    } finally {
      this.saving.set(false);
    }
  }

  protected async openProfile(user: UserSummary): Promise<void> {
    if (this.actionLoadingId() !== null) return;
    this.actionLoadingId.set(user.id);
    try {
      const profile = await firstValueFrom(this.profileService.getProfile(user.id));
      this.dialogs.open(UserProfileDialog, {
        header: 'Perfil do usuário',
        width: '32rem',
        modal: true,
        dismissableMask: true,
        breakpoints: { '560px': 'calc(100vw - 2rem)' },
        inputValues: {
          profile,
          editable: user.id === this.currentUserId(),
        },
      });
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível carregar o perfil do usuário.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  protected async toggleStatus(user: UserSummary): Promise<void> {
    if (this.actionLoadingId() !== null) return;
    if (user.enabled && (user.id === this.currentUserId() || user.role === 'ADMIN')) return;
    this.actionLoadingId.set(user.id);
    try {
      await firstValueFrom(this.usersService.toggleStatus(user.id, !user.enabled));
      this.notifications.success(
        `Usuário “${user.userName}” ${user.enabled ? 'desativado' : 'ativado'} com sucesso.`,
      );
      this.usersResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível alterar o status do usuário.'),
      );
    } finally {
      this.actionLoadingId.set(null);
    }
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(0, page - 1));
  }

  protected nextPage(): void {
    const total = this.usersResource.value()?.totalPages ?? 0;
    this.page.update((page) => Math.min(page + 1, Math.max(0, total - 1)));
  }
}
