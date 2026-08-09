import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';

describe('app routes', () => {
  it('should provide a valid Angular router configuration', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    expect(() => TestBed.inject(Router)).not.toThrow();
  });
});
