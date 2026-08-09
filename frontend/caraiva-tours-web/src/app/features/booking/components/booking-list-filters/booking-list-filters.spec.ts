import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputMaskDirective } from 'primeng/inputmask';

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

  it('should configure the phone mask used when creating a booking', () => {
    const inputMask = fixture.debugElement
      .query(By.css('.search-field input'))
      .injector.get(InputMaskDirective);

    expect(inputMask.pInputMask()).toBe('(99) 99999-9999');
    expect(inputMask.slotChar()).toBe('0');
    expect(searchInput.maxLength).toBe(20);
  });

  it('should identify the field as a phone search', () => {
    expect(searchInput.placeholder).toBe('Buscar por n° de telefone');
  });

  it('should clear the search model when the phone mask has no typed digits', () => {
    fixture.componentRef.setInput('search', '(73) 99999-9999');
    fixture.detectChanges();
    searchInput.value = '(00) 00000-0000';

    const inputMask = fixture.debugElement
      .query(By.css('.search-field input'))
      .injector.get(InputMaskDirective);
    inputMask.onUnmaskedChange.emit('');
    fixture.detectChanges();

    expect(fixture.componentInstance.search()).toBe('');
  });
});
