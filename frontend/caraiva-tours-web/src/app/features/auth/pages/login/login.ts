import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputPasswordModule } from 'primeng/inputpassword';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../../../core/auth/auth';
import { Router } from '@angular/router';
import { TokenStore } from '../../../../core/auth/token/token-store';
import { finalize, timeout, TimeoutError } from 'rxjs';
import { RateLimitError, StandardError, ValidationError } from '../../../../core/http/api-error';

const LOGIN_TIMEOUT_MS = 10_000;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, InputPasswordModule, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly authService = inject(Auth);
  protected readonly router = inject(Router);
  protected readonly tokenStore = inject(TokenStore);
  protected readonly currentYear = new Date().getFullYear();
  protected isPasswordMasked = true;
  protected isLoading = false;
  protected authenticationError = '';

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
    this.authenticationError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const credentials = this.loginForm.getRawValue();

    this.authService
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
        error: (error: unknown) => this.handleAuthenticationError(error),
      });
  }

  private handleAuthenticationError(error: unknown): void {
    if (error instanceof TimeoutError) {
      this.authenticationError =
        'O servidor demorou para responder. Verifique sua conexão e tente novamente.';
      return;
    }

    if (!(error instanceof HttpErrorResponse)) {
      this.authenticationError =
        'Ocorreu um erro ao tentar autenticar. Por favor, tente novamente mais tarde.';
      return;
    }

    switch (error.status) {
      case 0:
        this.authenticationError =
          'Não foi possível conectar ao servidor. Verifique se o backend está em execução.';
        break;
      case 400:
        this.authenticationError = this.getValidationErrorMessage(error.error as ValidationError);
        break;
      case 401:
      case 403:
        this.authenticationError = (error.error as StandardError).message;
        break;
      case 429:
        this.authenticationError = (error.error as RateLimitError).message;
        break;
      default:
        this.authenticationError = (error.error as StandardError).message;
    }
  }

  private getValidationErrorMessage(error: ValidationError): string {
    return Object.values(error.errors).join(' ');
  }
}
