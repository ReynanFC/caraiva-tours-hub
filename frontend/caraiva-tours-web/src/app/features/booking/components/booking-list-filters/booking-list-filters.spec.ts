import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingListFilters } from './booking-list-filters';

describe('BookingListFilters', () => {
  let fixture: ComponentFixture<BookingListFilters>;
  let searchInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingListFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingListFilters);
    fixture.componentRef.setInput('selectedStatus', 'ALL');
    fixture.componentRef.setInput('search', '');
    fixture.detectChanges();
    await fixture.whenStable();

    searchInput = fixture.nativeElement.querySelector('.search-field input');
  });

  it('should configure the phone input used when creating a booking', () => {
    expect(searchInput.maxLength).toBe(20);
  });

  it('should identify the field as a phone search', () => {
    expect(searchInput.placeholder).toBe('Buscar por n° de telefone');
  });

  it('should clear the search model when the phone input is emptied', () => {
    fixture.componentRef.setInput('search', '(73) 99999-9999');
    fixture.detectChanges();
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.search()).toBe('');
  });
});
