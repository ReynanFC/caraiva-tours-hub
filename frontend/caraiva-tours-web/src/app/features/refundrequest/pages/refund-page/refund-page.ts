import { Component, computed, inject, resource, signal, viewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { getApiErrorMessage } from '../../../../core/http/api-error';
import { SessionStore } from '../../../../core/auth/session/session-store';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import { RefundForm } from '../../components/refund-form/refund-form';
import { RefundList } from '../../components/refund-list/refund-list';
import { CreateRefundRequest, RefundStatus } from '../../models/refund-request.model';
import { RefundService } from '../../services/refund.service';

@Component({
  selector: 'app-refund-page',
  imports: [RefundForm, RefundList],
  templateUrl: './refund-page.html',
  styleUrl: './refund-page.css',
})
export class RefundPage {
  private readonly service = inject(RefundService);
  private readonly notifications = inject(ActionNotificationService);
  private readonly sessionStore = inject(SessionStore);
  private readonly formComponent = viewChild(RefundForm);

  protected readonly page = signal(0);
  protected readonly saving = signal(false);
  protected readonly resolvingId = signal<number | null>(null);
  protected readonly isAdmin = this.sessionStore.isAdmin;
  protected readonly profileLoading = this.sessionStore.isLoading;
  protected readonly pageSize = 10;
  protected readonly requestsResource = resource({
    params: () => ({ page: this.page(), admin: this.isAdmin() }),
    loader: ({ params }) =>
      firstValueFrom(
        params.admin
          ? this.service.getAllRequests(params.page, this.pageSize)
          : this.service.getEmployeeRequests(params.page, this.pageSize),
      ),
  });
  protected readonly bookingOptionsResource = resource({
    params: () => ({ admin: this.isAdmin() }),
    loader: ({ params }) =>
      params.admin ? Promise.resolve([]) : firstValueFrom(this.service.getBookingOptions()),
  });
  protected readonly requests = computed(() => this.requestsResource.value()?.content ?? []);

  protected async createRequest(request: CreateRefundRequest): Promise<void> {
    this.notifications.clear();
    this.saving.set(true);
    try {
      await firstValueFrom(this.service.createRequest(request));
      this.formComponent()?.reset();
      this.page.set(0);
      this.requestsResource.reload();
      this.bookingOptionsResource.reload();
      this.notifications.success('Solicitação de reembolso enviada com sucesso.');
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível enviar a solicitação de reembolso.'),
      );
    } finally {
      this.saving.set(false);
    }
  }

  protected changePage(page: number): void {
    this.page.set(page);
  }

  protected async resolveRequest(
    id: number,
    status: Extract<RefundStatus, 'APPROVED' | 'REJECTED'>,
  ): Promise<void> {
    this.notifications.clear();
    this.resolvingId.set(id);
    try {
      await firstValueFrom(this.service.resolveRequest(id, { refundStatus: status }));
      this.requestsResource.reload();
      this.notifications.success(
        status === 'APPROVED'
          ? 'Solicitação de reembolso aprovada com sucesso.'
          : 'Solicitação de reembolso rejeitada.',
      );
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível responder à solicitação de reembolso.'),
      );
    } finally {
      this.resolvingId.set(null);
    }
  }
}
