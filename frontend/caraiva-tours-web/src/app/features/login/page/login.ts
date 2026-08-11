import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputPasswordModule } from 'primeng/inputpassword';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { TokenStore } from '../../../core/auth/token/token-store';
import { finalize, timeout, TimeoutError } from 'rxjs';
import { getApiErrorMessage, RateLimitError } from '../../../core/http/api-error';
import { LoginService } from '../services/login.service';
import { ActionNotificationService } from '../../../shared/components/action-notification/action-notification.service';

const LOGIN_TIMEOUT_MS = 10_000;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, InputPasswordModule, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly loginService = inject(LoginService);
  protected readonly router = inject(Router);
  protected readonly tokenStore = inject(TokenStore);
  private readonly notifications = inject(ActionNotificationService);
  protected readonly currentYear = new Date().getFullYear();
  protected isPasswordMasked = true;
  protected isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });

  get emailControl() {
    return this.loginForm.controls.email;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  onSubmit(): void {
    this.notifications.clear();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const credentials = this.loginForm.getRawValue();

    this.loginService
      .signIn(credentials)
      .pipe(
        timeout(LOGIN_TIMEOUT_MS),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: ({ accessToken }) => {
          this.tokenStore.setAccessToken(accessToken);
          void this.router.navigate(['/dashboard']);
        },
        error: (error: unknown) => void this.handleAuthenticationError(error),
      });
  }

  private async handleAuthenticationError(error: unknown): Promise<void> {
    if (error instanceof TimeoutError) {
      this.notifications.error(
        'O servidor demorou para responder. Verifique sua conexão e tente novamente.',
        5_000,
      );
      return;
    }

    if (!(error instanceof HttpErrorResponse)) {
      this.notifications.error(
        'Ocorreu um erro ao tentar autenticar. Por favor, tente novamente mais tarde.',
        5_000,
      );
      return;
    }

    if (error.status === 0) {
      this.notifications.error(
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
        5_000,
      );
      return;
    }

    const message = await getApiErrorMessage(
      error,
      'Não foi possível entrar. Verifique seus dados e tente novamente.',
    );

    if (error.status === 429) {
      const retryAfter = this.getRetryAfterSeconds(error);
      const retryMessage =
        retryAfter > 0
          ? `${message} Tente novamente em ${this.formatWaitTime(retryAfter)}.`
          : `${message} Aguarde alguns minutos antes de tentar novamente.`;
      this.notifications.error(retryMessage, 8_000);
      return;
    }

    this.notifications.error(message, 5_000);
  }

  private getRetryAfterSeconds(error: HttpErrorResponse): number {
    const payload = error.error as Partial<RateLimitError> | null;
    const bodyValue = Number(payload?.retryAfterSeconds);
    if (Number.isFinite(bodyValue) && bodyValue > 0) return Math.ceil(bodyValue);

    const headerValue = Number(error.headers.get('Retry-After'));
    return Number.isFinite(headerValue) && headerValue > 0 ? Math.ceil(headerValue) : 0;
  }

  private formatWaitTime(seconds: number): string {
    if (seconds < 60) return `${seconds} segundo${seconds === 1 ? '' : 's'}`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minuto${minutes === 1 ? '' : 's'}`;
  }
}
