import { DatePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { getApiErrorMessage } from '../../../core/http/api-error';
import { UserDetails } from '../../models/user.model';
import { UserProfileService } from '../../services/user-profile.service';
import { ActionNotificationService } from '../action-notification/action-notification.service';
import { Input } from '../input/input';
import { passwordMeetsRequirements } from '../../utils/password.utils';

type ProfileTab = 'details' | 'edit' | 'password';

function matchingPasswords(control: AbstractControl): ValidationErrors | null {
  const value = control.value as { newPassword?: string; passwordConfirmation?: string };
  return value.newPassword === value.passwordConfirmation ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-user-profile-dialog',
  imports: [ButtonModule, DatePipe, Input, PIcon, ReactiveFormsModule],
  templateUrl: './user-profile-dialog.html',
  styleUrl: './user-profile-dialog.css',
})
export class UserProfileDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly profileService = inject(UserProfileService);
  private readonly notifications = inject(ActionNotificationService);

  readonly profile = input.required<UserDetails>();
  readonly editable = input(false);
  readonly profileUpdated = input<((profile: UserDetails) => void) | undefined>();

  protected readonly tab = signal<ProfileTab>('details');
  protected readonly saving = signal(false);
  protected readonly editForm = new FormGroup({
    userName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
    pixKey: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(255)] }),
  });
  protected readonly passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          (control) =>
            passwordMeetsRequirements(control.value) ? null : { passwordRequirements: true },
        ],
      }),
      passwordConfirmation: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [matchingPasswords] },
  );

  protected initials(): string {
    const parts = this.profile().fullName.trim().split(/\s+/);
    return `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`.toUpperCase();
  }

  protected roleLabel(): string {
    return this.profile().role === 'ADMIN' ? 'Administrador' : 'Funcionário';
  }

  protected openTab(tab: ProfileTab): void {
    if (tab !== 'details' && !this.editable()) return;
    if (tab === 'edit') {
      this.editForm.reset({
        userName: this.profile().userName,
        email: this.profile().email,
        pixKey: this.profile().pixKey ?? '',
      });
    } else if (tab === 'password') {
      this.passwordForm.reset();
    }
    this.tab.set(tab);
  }

  protected async saveProfile(): Promise<void> {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const value = this.editForm.getRawValue();
    this.saving.set(true);
    try {
      await firstValueFrom(
        this.profileService.updateProfile(this.profile().id, {
          userName: value.userName.trim(),
          email: value.email.trim(),
          pixKey: value.pixKey.trim(),
        }),
      );
      const updated = await firstValueFrom(this.profileService.getMyProfile());
      this.profileUpdated()?.(updated);
      this.notifications.success('Dados do perfil atualizados com sucesso.');
      this.ref.close(updated);
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível atualizar os dados do perfil.'),
      );
    } finally {
      this.saving.set(false);
    }
  }

  protected async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const value = this.passwordForm.getRawValue();
    this.saving.set(true);
    try {
      await firstValueFrom(
        this.profileService.changePassword(this.profile().id, {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        }),
      );
      this.notifications.success('Senha alterada com sucesso.');
      this.ref.close();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível alterar a senha.'),
      );
    } finally {
      this.saving.set(false);
    }
  }

  protected close(): void {
    this.ref.close();
  }
}
