import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { Login } from './login';
import { ActionNotificationService } from '../../../shared/components/action-notification/action-notification.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require email and password', () => {
    expect(component.emailControl.hasError('required')).toBe(true);
    expect(component.passwordControl.hasError('required')).toBe(true);
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should validate the email format and maximum length', () => {
    component.emailControl.setValue('email-invalido');
    expect(component.emailControl.hasError('email')).toBe(true);

    component.emailControl.setValue(`${'a'.repeat(89)}@example.com`);
    expect(component.emailControl.hasError('maxlength')).toBe(true);
  });

  it('should limit the password to 255 characters', () => {
    component.passwordControl.setValue('a'.repeat(256));
    expect(component.passwordControl.hasError('maxlength')).toBe(true);
  });

  it('should mark every field as touched when an invalid form is submitted', () => {
    component.onSubmit();

    expect(component.emailControl.touched).toBe(true);
    expect(component.passwordControl.touched).toBe(true);
  });

  it('should show the translated backend message for invalid credentials', async () => {
    const notifications = TestBed.inject(ActionNotificationService);
    const notify = vi.spyOn(notifications, 'error');
    const error = new HttpErrorResponse({
      status: 401,
      error: { message: 'Invalid username or password' },
    });

    await (component as any).handleAuthenticationError(error);

    expect(notify).toHaveBeenCalledWith('E-mail ou senha inválidos.', 5_000);
  });

  it('should include the backend retry time in rate-limit errors', async () => {
    const notifications = TestBed.inject(ActionNotificationService);
    const notify = vi.spyOn(notifications, 'error');
    const error = new HttpErrorResponse({
      status: 429,
      error: {
        message: 'Too many requests, try again later',
        retryAfterSeconds: 121,
      },
    });

    await (component as any).handleAuthenticationError(error);

    expect(notify).toHaveBeenCalledWith(
      'Muitas tentativas realizadas. Tente novamente em 3 minutos.',
      8_000,
    );
  });
});
