import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SessionStore } from '../../../../core/auth/session/session-store';
import { UserProfileService } from '../../../../shared/services/user-profile.service';
import { UsersService } from '../../services/users';
import { UsersList } from './users-list';

describe('UsersList', () => {
  let fixture: ComponentFixture<UsersList>;
  const usersServiceMock = {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    toggleStatus: vi.fn(),
  };
  const profileServiceMock = {
    getProfile: vi.fn(),
  };
  const sessionStoreMock = {
    isAdmin: signal(true),
    userProfile: () => ({ id: 1, name: 'Administrador', role: 'ADMIN' }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    usersServiceMock.getUsers.mockReturnValue(
      of({
        content: [
          {
            id: 2,
            userName: 'maria.souza',
            email: 'maria@porto.com',
            role: 'EMPLOYEE',
            enabled: true,
          },
        ],
        page: 0,
        size: 9,
        totalElements: 1,
        totalPages: 1,
      }),
    );

    await TestBed.configureTestingModule({
      imports: [UsersList],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: UserProfileService, useValue: profileServiceMock },
        { provide: SessionStore, useValue: sessionStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersList);
    await fixture.whenStable();
  });

  it('should render users returned by the API', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(text).toContain('maria.souza');
    expect(text).toContain('maria@porto.com');
    expect(text).toContain('Funcionário');
    expect(text).toContain('Ativo');
  });

  it('should request the opposite status when toggling a user', async () => {
    usersServiceMock.toggleStatus.mockReturnValue(of({}));
    const user = {
      id: 2,
      userName: 'maria.souza',
      email: 'maria@porto.com',
      role: 'EMPLOYEE' as const,
      enabled: true,
    };

    await (fixture.componentInstance as any).toggleStatus(user);

    expect(usersServiceMock.toggleStatus).toHaveBeenCalledWith(2, false);
  });

  it.each([
    { id: 1, label: 'the authenticated administrator' },
    { id: 3, label: 'another administrator' },
  ])('should not deactivate $label', async ({ id }) => {
    const administrator = {
      id,
      userName: 'admin',
      email: 'admin@porto.com',
      role: 'ADMIN' as const,
      enabled: true,
    };

    await (fixture.componentInstance as any).toggleStatus(administrator);

    expect(usersServiceMock.toggleStatus).not.toHaveBeenCalled();
  });

  it('should allow activating a disabled administrator', async () => {
    usersServiceMock.toggleStatus.mockReturnValue(of({}));
    const administrator = {
      id: 3,
      userName: 'admin',
      email: 'admin@porto.com',
      role: 'ADMIN' as const,
      enabled: false,
    };

    await (fixture.componentInstance as any).toggleStatus(administrator);

    expect(usersServiceMock.toggleStatus).toHaveBeenCalledWith(3, true);
  });
});
