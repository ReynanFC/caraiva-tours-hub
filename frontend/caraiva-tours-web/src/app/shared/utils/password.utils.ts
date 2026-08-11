export interface PasswordRequirement {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: readonly PasswordRequirement[] = [
  {
    id: 'minLength',
    label: 'Pelo menos 12 caracteres',
    test: (value) => value.length >= 12,
  },
  {
    id: 'uppercase',
    label: 'Uma letra maiúscula',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'Uma letra minúscula',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'Um número',
    test: (value) => /[0-9]/.test(value),
  },
  {
    id: 'symbol',
    label: 'Um caractere especial (@$!%*?&)',
    test: (value) => /[@$!%*?&]/.test(value),
  },
];

export function passwordMeetsRequirements(value: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(value));
}
