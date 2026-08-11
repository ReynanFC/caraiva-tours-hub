import { computed, inject, resource, Service } from '@angular/core';
import { Layout } from '../../layout/service/layout';
import { UserProfile } from '../../layout/models/user-profile';
import { TokenStore } from '../token/token-store';
import { firstValueFrom } from 'rxjs';

@Service()
export class SessionStore {

  private readonly STANDARD_MESSAGE = "Você não possui autorização para realizar essa requisição";
  private readonly layoutService = inject(Layout);
  private readonly tokenStore = inject(TokenStore);
  private profileRequest: Promise<UserProfile> | null = null;

  readonly profileResource = resource({
    params: () => ({ token: this.tokenStore.getAccessToken() }),
    loader: async ({ params }) => {
      if (!params.token) return null;

      this.profileRequest ??= firstValueFrom(this.layoutService.getUserProfile());

      try {
        return await this.profileRequest;
      } finally {
        this.profileRequest = null;
      }
    },
  });

  readonly userProfile = () => this.profileResource.value();
  readonly isLoading = () => this.profileResource.isLoading();

  readonly isAdmin = computed(
    () => this.profileResource.hasValue() && this.profileResource.value()?.role === 'ADMIN',
  );

  clear(): void {
    this.profileResource.reload();
  }

  hasPermissionAdmin(): void {

    if (!this.isAdmin()) {
      throw new Error(this.STANDARD_MESSAGE);
    }
  }

  hasPermissionEmployee(): void {

    if (this.isAdmin()) {
      throw new Error(this.STANDARD_MESSAGE);
    }
  }
}
