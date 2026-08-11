import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-pagination',
  templateUrl: './user-pagination.html',
  styleUrl: './user-pagination.css',
})
export class UserPagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly previous = output<void>();
  readonly next = output<void>();
}
