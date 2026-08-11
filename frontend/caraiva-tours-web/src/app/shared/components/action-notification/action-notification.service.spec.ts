import { TestBed } from '@angular/core/testing';

import { ActionNotificationService } from './action-notification.service';

describe('ActionNotificationService', () => {
  let service: ActionNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionNotificationService);
  });

  it('should publish a standard success card', () => {
    const add = vi.spyOn(service.messages, 'add');

    service.success('Passeio salvo.');

    expect(add).toHaveBeenCalledWith({
      key: 'action-notifications',
      severity: 'success',
      summary: 'Ação concluída',
      detail: 'Passeio salvo.',
      life: 2_000,
      closable: false,
    });
  });

  it('should publish an error card with the backend message', () => {
    const add = vi.spyOn(service.messages, 'add');

    service.error('Este passeio possui reservas vinculadas.');

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        detail: 'Este passeio possui reservas vinculadas.',
      }),
    );
  });
});
