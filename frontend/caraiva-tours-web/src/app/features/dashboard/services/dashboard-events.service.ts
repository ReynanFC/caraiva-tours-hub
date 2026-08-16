import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import { TokenStore } from '../../../core/auth/token/token-store';
import { Auth } from '../../../core/service/auth';
import { DashboardChangedEvent, DashboardStreamEvent } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardEventsService {
  private readonly tokenStore = inject(TokenStore);
  private readonly auth = inject(Auth);

  connect(): Observable<DashboardStreamEvent> {
    return new Observable((subscriber) => {
      const controller = new AbortController();

      void this.consumeWithReconnect(controller.signal, (event) => subscriber.next(event)).catch(
        (error: unknown) => {
          if (!controller.signal.aborted) subscriber.error(error);
        },
      );

      return () => controller.abort();
    });
  }

  private async consumeWithReconnect(
    signal: AbortSignal,
    emit: (event: DashboardStreamEvent) => void,
  ): Promise<void> {
    let connectedOnce = false;
    let retryDelay = 1_000;

    while (!signal.aborted) {
      try {
        const response = await this.openStream(signal);

        if (!response.ok) {
          if (response.status === 401) {
            await firstValueFrom(this.auth.refreshToken());
            continue;
          }
          throw new Error(`Dashboard SSE respondeu com status ${response.status}`);
        }

        if (!response.body) throw new Error('Dashboard SSE não retornou um stream');

        if (connectedOnce) emit({ type: 'reconnected' });
        connectedOnce = true;
        retryDelay = 1_000;
        await this.readStream(response.body, emit, signal);
      } catch (error: unknown) {
        if (signal.aborted) return;

        await this.delay(retryDelay, signal);
        retryDelay = Math.min(retryDelay * 2, 15_000);
      }
    }
  }

  private openStream(signal: AbortSignal): Promise<Response> {
    const token = this.tokenStore.getAccessToken();
    if (!token) return Promise.reject(new Error('Sessão não autenticada'));

    return fetch('/api/dashboard/events', {
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`,
      },
      signal,
    });
  }

  private async readStream(
    stream: ReadableStream<Uint8Array>,
    emit: (event: DashboardStreamEvent) => void,
    signal: AbortSignal,
  ): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (!signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        buffer = buffer.replace(/\r\n/g, '\n');
        let boundary = buffer.indexOf('\n\n');

        while (boundary >= 0) {
          this.emitMessage(buffer.slice(0, boundary), emit);
          buffer = buffer.slice(boundary + 2);
          boundary = buffer.indexOf('\n\n');
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private emitMessage(message: string, emit: (event: DashboardStreamEvent) => void): void {
    let eventName = 'message';
    const data: string[] = [];

    for (const line of message.split('\n')) {
      if (line.startsWith('event:')) eventName = line.slice(6).trim();
      if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
    }

    if (eventName !== 'dashboard-changed' || data.length === 0) return;

    try {
      const parsed = JSON.parse(data.join('\n')) as DashboardChangedEvent;
      if (parsed.view === 'USER' || parsed.view === 'FINANCE') {
        emit({ type: 'dashboard-changed', data: parsed });
      }
    } catch {
      // Ignore uma mensagem inválida e mantenha a conexão para os próximos eventos.
    }
  }

  private delay(milliseconds: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
      const timeout = window.setTimeout(resolve, milliseconds);
      signal.addEventListener(
        'abort',
        () => {
          window.clearTimeout(timeout);
          resolve();
        },
        { once: true },
      );
    });
  }
}
