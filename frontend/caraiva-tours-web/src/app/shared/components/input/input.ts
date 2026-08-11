import { booleanAttribute, Component, forwardRef, input, numberAttribute } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { PASSWORD_REQUIREMENTS } from '../../utils/password.utils';

export type InputFormat =
  | 'text'
  | 'email'
  | 'password'
  | 'phone'
  | 'cep'
  | 'currency'
  | 'percentage'
  | 'integer'
  | 'datetime-local';

@Component({
  selector: 'app-input',
  imports: [FormsModule, InputMaskModule, InputNumberModule, InputTextModule, PIcon],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input {
  readonly inputId = input<string>();
  readonly format = input<InputFormat>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string>();
  readonly maxlength = input<number | undefined, string | number | undefined>(undefined, {
    transform: (value) => (value === undefined ? undefined : numberAttribute(value)),
  });
  readonly min = input<number | undefined, string | number | undefined>(undefined, {
    transform: (value) => (value === undefined ? undefined : numberAttribute(value)),
  });
  readonly max = input<number | undefined, string | number | undefined>(undefined, {
    transform: (value) => (value === undefined ? undefined : numberAttribute(value)),
  });
  readonly suffix = input<string>();
  readonly icon = input<string>();
  readonly passwordFeedback = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly inputClass = input('shared-input');

  protected value: string | number | null = null;
  protected disabled = false;
  protected readonly passwordRequirements = PASSWORD_REQUIREMENTS;

  protected get passwordValue(): string {
    return typeof this.value === 'string' ? this.value : '';
  }

  protected get nativeType(): string {
    return ['email', 'password', 'datetime-local'].includes(this.format()) ? this.format() : 'text';
  }

  protected get isMasked(): boolean {
    return this.format() === 'phone' || this.format() === 'cep';
  }

  protected get isNumeric(): boolean {
    return ['currency', 'percentage', 'integer'].includes(this.format());
  }

  protected change(value: string | number | null): void {
    this.value = value;
    this.onChange(value);
  }

  protected maskedChange(unmaskedValue: string): void {
    if (!unmaskedValue) {
      this.change('');
    }
  }

  protected blur(): void {
    this.onTouched();
  }

  writeValue(value: string | number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  private onChange: (value: string | number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
}
