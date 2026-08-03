import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputPasswordModule } from 'primeng/inputpassword';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, InputPasswordModule, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly currentYear = new Date().getFullYear();
  protected isPasswordMasked = true;
  protected isLoading = false;
  protected authenticationError = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  });

  get emailControl() { return this.loginForm.controls.email; }
  get passwordControl() { return this.loginForm.controls.password; }

  onSubmit() {
    this.authenticationError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    window.setTimeout(() => {
      this.isLoading = false;
      this.authenticationError = 'E-mail ou senha incorretos.';
    }, 900);
  }
}
