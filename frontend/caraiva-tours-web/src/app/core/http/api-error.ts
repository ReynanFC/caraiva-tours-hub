import { HttpErrorResponse } from '@angular/common/http';

import apiMessageTranslations from '../../../assets/i18n/errors-pt.json';

export interface StandardError {
  timestamp: string;
  message: string;
  path: string;
  traceId: string;
}

export interface ValidationError {
  timestamp: string;
  errors: Record<string, string>;
  path: string;
  traceId: string;
}

export interface RateLimitError {
  timestamp: string;
  message: string;
  path: string;
  traceId: string;
  retryAfterSeconds: number;
}

const DYNAMIC_API_MESSAGE_TRANSLATIONS: readonly [RegExp, (match: RegExpMatchArray) => string][] = [
  [/^Tour not found with ID: (.+)$/i, (match) => `Passeio não encontrado com o ID: ${match[1]}.`],
  [
    /^Category not found with ID: (.+)$/i,
    (match) => `Categoria não encontrada com o ID: ${match[1]}.`,
  ],
  [
    /^Booking not found with ID: (.+)$/i,
    (match) => `Reserva não encontrada com o ID: ${match[1]}.`,
  ],
  [
    /^Payment not found with id: (.+)$/i,
    (match) => `Pagamento não encontrado com o ID: ${match[1]}.`,
  ],
  [
    /^User not found with (?:ID|id): (.+)$/i,
    (match) => `Usuário não encontrado com o ID: ${match[1]}.`,
  ],
  [
    /^User not found with email: (.+)$/i,
    (match) => `Usuário não encontrado com o e-mail: ${match[1]}.`,
  ],
  [/^The email (.+) already exists$/i, (match) => `O e-mail ${match[1]} já está cadastrado.`],
  [
    /^Refund request not found with ID: (.+)$/i,
    (match) => `Solicitação de reembolso não encontrada com o ID: ${match[1]}.`,
  ],
  [
    /^This Booking cannot be changed\/accessed because its status is: (.+)$/i,
    (match) => `Esta reserva não pode ser alterada ou acessada porque seu status é ${match[1]}.`,
  ],
];

export function translateApiMessage(message: string): string {
  const normalized = message.trim();
  const exactTranslation = (apiMessageTranslations as Readonly<Record<string, string>>)[normalized];
  if (exactTranslation) return exactTranslation;

  for (const [pattern, translate] of DYNAMIC_API_MESSAGE_TRANSLATIONS) {
    const match = normalized.match(pattern);
    if (match) return translate(match);
  }

  return normalized;
}

export async function getApiErrorMessage(error: unknown, fallbackMessage: string): Promise<string> {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }

  let payload: unknown = error.error;

  if (typeof Blob !== 'undefined' && payload instanceof Blob) {
    const body = await payload.text();

    try {
      payload = JSON.parse(body) as unknown;
    } catch {
      return body.trim() ? translateApiMessage(body) : fallbackMessage;
    }
  }

  if (typeof payload === 'string') {
    return payload.trim() ? translateApiMessage(payload) : fallbackMessage;
  }

  if (!payload || typeof payload !== 'object') {
    return fallbackMessage;
  }

  if ('errors' in payload && payload.errors && typeof payload.errors === 'object') {
    const messages = [
      ...new Set(
        Object.values(payload.errors)
          .filter((message): message is string => typeof message === 'string')
          .map((message) => translateApiMessage(message))
          .filter(Boolean),
      ),
    ];

    if (messages.length) {
      return messages.join(' ');
    }
  }

  if ('message' in payload && typeof payload.message === 'string' && payload.message.trim()) {
    return translateApiMessage(payload.message);
  }

  return fallbackMessage;
}
