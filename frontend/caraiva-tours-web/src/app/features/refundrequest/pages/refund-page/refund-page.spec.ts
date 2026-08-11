import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RefundPage } from './refund-page';

describe('RefundPage', () => {
  it('creates the page', async () => {
    await TestBed.configureTestingModule({
      imports: [RefundPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(RefundPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
