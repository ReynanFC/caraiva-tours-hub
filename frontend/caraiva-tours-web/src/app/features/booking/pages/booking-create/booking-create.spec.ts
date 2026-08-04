import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCreate } from './booking-create';

describe('BookingCreate', () => {
  let fixture: ComponentFixture<BookingCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingCreate);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
