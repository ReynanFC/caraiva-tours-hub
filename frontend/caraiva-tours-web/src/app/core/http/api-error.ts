import { HttpErrorResponse } from '@angular/common/http';

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
      return body.trim() || fallbackMessage;
    }
  }

  if (typeof payload === 'string') {
    return payload.trim() || fallbackMessage;
  }

  if (!payload || typeof payload !== 'object') {
    return fallbackMessage;
  }

  if ('errors' in payload && payload.errors && typeof payload.errors === 'object') {
    const messages = [
      ...new Set(
        Object.values(payload.errors)
          .filter((message): message is string => typeof message === 'string')
          .map((message) => message.trim())
          .filter(Boolean),
      ),
    ];

    if (messages.length) {
      return messages.join(' ');
    }
  }

  if ('message' in payload && typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }

  return fallbackMessage;
}
