import { computed, Service, signal } from '@angular/core';

@Service()
export class TokenStore {
  private readonly accessToken = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this.accessToken() !== null);

  setAccessToken(token: string | null): void {
    this.accessToken.set(token);
  }

  clearToken(): void {
    this.accessToken.set(null);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }
}
