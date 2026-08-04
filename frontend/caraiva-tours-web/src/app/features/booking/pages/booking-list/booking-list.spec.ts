import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingList } from './booking-list';

describe('BookingList', () => {
  let fixture: ComponentFixture<BookingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingList],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingList);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
