import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Input } from '../../../../shared/components/input/input';
import { CategoryListItem } from '../../model/category.model';

@Component({
  selector: 'app-tours-list-filters',
  imports: [FormsModule, Input],
  templateUrl: './tours-list-filters.html',
  styleUrl: './tours-list-filters.css',
})
export class ToursListFilters {
  readonly search = input.required<string>();
  readonly selectedCategoryId = input<number | undefined>();
  readonly categories = input.required<readonly CategoryListItem[]>();
  readonly totalTours = input(0);
  readonly searchChange = output<string>();
  readonly categoryChange = output<number | undefined>();

  protected readonly visibleCategories = () => this.categories().slice(0, 5);
  protected readonly overflowCategories = () => this.categories().slice(5);

  protected selectOverflow(value: string): void {
    this.categoryChange.emit(value ? Number(value) : undefined);
  }
}
