import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PasswordRecovery } from './password-recovery';

describe('PasswordRecovery', () => {
  it('validates the e-mail recovery form', async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecovery],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const component = TestBed.createComponent(PasswordRecovery).componentInstance;
    expect(component.emailControl.hasError('required')).toBe(true);
    component.emailControl.setValue('invalido');
    expect(component.emailControl.hasError('email')).toBe(true);
  });
});
