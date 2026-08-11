import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs';

import { getApiErrorMessage } from '../../../../core/http/api-error';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import {
  PASSWORD_REQUIREMENTS,
  passwordMeetsRequirements,
} from '../../../../shared/utils/password.utils';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-password-recovery',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, PasswordModule, InputTextModule],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css',
})
export class PasswordRecovery {
  private readonly service = inject(LoginService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(ActionNotificationService);

  protected readonly currentYear = new Date().getFullYear();
  protected readonly token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
  protected readonly isResetMode = this.router.url.startsWith('/reset-password');
  protected readonly passwordRequirements = PASSWORD_REQUIREMENTS;
  protected isLoading = false;
  protected requestSent = false;
  protected resetComplete = false;
  readonly forgotForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
  });

  readonly resetForm = new FormGroup(
    {
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          (control) =>
            passwordMeetsRequirements(control.value) ? null : { passwordRequirements: true },
        ],
      }),
      confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    {
      validators: (form) =>
        form.get('password')?.value === form.get('confirmation')?.value
          ? null
          : { passwordMismatch: true },
    },
  );

  get emailControl() {
    return this.forgotForm.controls.email;
  }

  get passwordControl() {
    return this.resetForm.controls.password;
  }

  get confirmationControl() {
    return this.resetForm.controls.confirmation;
  }

  protected requestReset(): void {
    this.notifications.clear();
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.service
      .requestPasswordReset(this.emailControl.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => (this.requestSent = true),
        error: (error: unknown) => void this.showError(error, 'Não foi possível enviar o link.'),
      });
  }

  protected resetPassword(): void {
    this.notifications.clear();
    if (!this.token) {
      this.notifications.error('O link de redefinição é inválido ou está incompleto.', 6_000);
      return;
    }
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.service
      .resetPassword(this.token, this.passwordControl.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => (this.resetComplete = true),
        error: (error: unknown) =>
          void this.showError(error, 'Não foi possível redefinir a senha. Solicite um novo link.'),
      });
  }

  private async showError(error: unknown, fallback: string): Promise<void> {
    const message =
      error instanceof HttpErrorResponse && error.status === 0
        ? 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
        : await getApiErrorMessage(error, fallback);
    this.notifications.error(message, 6_000);
  }
}
