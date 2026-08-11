import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { Input } from '../../../../shared/components/input/input';
import { CreateUserRequest } from '../../models/user-admin.model';

@Component({
  selector: 'app-user-create-dialog',
  imports: [ButtonModule, Input, ReactiveFormsModule],
  templateUrl: './user-create-dialog.html',
  styleUrl: './user-create-dialog.css',
})
export class UserCreateDialog {
  readonly saving = input(false);
  readonly closed = output<void>();
  readonly submitted = output<CreateUserRequest>();
  protected readonly form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    userName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
    pixKey: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(255)] }),
    role: new FormControl<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE', { nonNullable: true }),
  });

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }
}
