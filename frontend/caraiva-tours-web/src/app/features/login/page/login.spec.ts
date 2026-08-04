import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
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
});
