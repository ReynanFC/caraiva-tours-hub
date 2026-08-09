import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { computed, signal } from '@angular/core';
import { UserProfile } from '../models/user-profile';

import { SessionStore } from '../../auth/session/session-store';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;
  const profileValue = signal<UserProfile | null>(null);
  const sessionStoreMock = {
    profileResource: {
      value: profileValue,
      isLoading: signal(false),
      hasValue: computed(() => profileValue() !== null),
    },
    clear: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    profileValue.set(null);

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SessionStore, useValue: sessionStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the profile exposed by the session resource', () => {
    profileValue.set({ id: 7, name: 'Maria Oliveira', role: 'ADMIN' });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Maria Oliveira');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Administrador');
  });
});
