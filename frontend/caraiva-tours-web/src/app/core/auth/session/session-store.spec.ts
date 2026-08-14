import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Layout } from '../../layout/service/layout';
import { TokenStore } from '../token/token-store';
import { SessionStore } from './session-store';

describe('SessionStore', () => {
  const layoutServiceMock = {
    getUserProfile: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    layoutServiceMock.getUserProfile.mockReturnValue(
      of({ id: 7, name: 'Maria Oliveira', role: 'ADMIN' }),
    );

    TestBed.configureTestingModule({
      providers: [{ provide: Layout, useValue: layoutServiceMock }],
    });
  });

  it('should keep the profile empty without an authenticated session', async () => {
    const store = TestBed.inject(SessionStore);

    TestBed.tick();

    await vi.waitFor(() => expect(store.profileResource.value()).toBeNull());
    expect(layoutServiceMock.getUserProfile).not.toHaveBeenCalled();
  });

  it('should load the header resource for an authenticated session', async () => {
    TestBed.inject(TokenStore).setAccessToken('access-token');
    const store = TestBed.inject(SessionStore);

    TestBed.tick();

    await vi.waitFor(() => {
      expect(layoutServiceMock.getUserProfile).toHaveBeenCalledOnce();
      expect(store.profileResource.value()).toEqual({
        id: 7,
        name: 'Maria Oliveira',
        role: 'ADMIN',
      });
    });
  });

  it('should identify an administrator from the loaded profile', async () => {
    TestBed.inject(TokenStore).setAccessToken('access-token');
    const store = TestBed.inject(SessionStore);

    TestBed.tick();

    await vi.waitFor(() => expect(store.isAdmin()).toBe(true));
  });

  it('should read the authenticated user ID from the access token', () => {
    const payload = btoa(JSON.stringify({ userId: 17, role: 'EMPLOYEE' }));
    TestBed.inject(TokenStore).setAccessToken(`header.${payload}.signature`);

    const store = TestBed.inject(SessionStore);

    expect(store.userId()).toBe(17);
    expect(store.isEmployee()).toBe(true);
  });

  it('should request the header once per access token', async () => {
    const tokenStore = TestBed.inject(TokenStore);
    tokenStore.setAccessToken('access-token');
    const store = TestBed.inject(SessionStore);

    TestBed.tick();
    await vi.waitFor(() => expect(store.profileResource.hasValue()).toBe(true));
    expect(layoutServiceMock.getUserProfile).toHaveBeenCalledOnce();

    tokenStore.setAccessToken('access-token');
    TestBed.tick();
    expect(layoutServiceMock.getUserProfile).toHaveBeenCalledOnce();

    tokenStore.setAccessToken('refreshed-access-token');
    TestBed.tick();
    await vi.waitFor(() => expect(layoutServiceMock.getUserProfile).toHaveBeenCalledTimes(2));
  });

  it('should clear the resource after the token is removed', async () => {
    const tokenStore = TestBed.inject(TokenStore);
    tokenStore.setAccessToken('access-token');
    const store = TestBed.inject(SessionStore);

    TestBed.tick();
    await vi.waitFor(() => expect(store.profileResource.value()).not.toBeNull());

    tokenStore.clearToken();
    store.clear();
    TestBed.tick();

    await vi.waitFor(() => expect(store.profileResource.value()).toBeNull());
  });

  it('should expose errors from the header request', async () => {
    const requestError = new Error('Não foi possível carregar o perfil');
    layoutServiceMock.getUserProfile.mockReturnValue(throwError(() => requestError));
    TestBed.inject(TokenStore).setAccessToken('access-token');
    const store = TestBed.inject(SessionStore);

    TestBed.tick();

    await vi.waitFor(() => expect(store.profileResource.error()).toBe(requestError));
    expect(() => store.profileResource.value()).toThrow('Não foi possível carregar o perfil');
  });
});
