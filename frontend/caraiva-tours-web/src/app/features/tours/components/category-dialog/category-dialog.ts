import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { firstValueFrom } from 'rxjs';

import { Category as CategoryService } from '../../service/category';
import { Category, CategoryListItem } from '../../model/category.model';
import { Input } from '../../../../shared/components/input/input';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import { getApiErrorMessage } from '../../../../core/http/api-error';

@Component({
  selector: 'app-category-dialog',
  imports: [Input, PIcon, ReactiveFormsModule],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.css',
})
export class CategoryDialog {
  private readonly categoryService = inject(CategoryService);
  private readonly notifications = inject(ActionNotificationService);

  readonly categories = input.required<readonly CategoryListItem[]>();
  readonly closed = output<void>();
  readonly categoriesChanged = output<void>();

  protected readonly categoryName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100)],
  });
  protected readonly editingCategoryName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100)],
  });
  protected readonly editingCategoryId = signal<number | null>(null);

  protected clearError(): void {
    this.notifications.clear();
  }

  protected async createCategory(): Promise<void> {
    this.clearError();
    const name = this.categoryName.value.trim();
    if (!name) {
      this.notifications.error('Informe o nome da categoria.');
      return;
    }

    try {
      await firstValueFrom(this.categoryService.createCategory({ name }));
      this.categoryName.reset();
      this.notifications.success(`Categoria “${name}” criada com sucesso.`);
      this.categoriesChanged.emit();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível criar a categoria.'),
      );
    }
  }

  protected startEdit(category: Category): void {
    this.clearError();
    this.editingCategoryId.set(category.id);
    this.editingCategoryName.setValue(category.name);
  }

  protected async saveCategory(category: Category): Promise<void> {
    this.clearError();
    const name = this.editingCategoryName.value.trim();
    if (!name) {
      this.notifications.error('Informe o nome da categoria.');
      return;
    }

    try {
      await firstValueFrom(this.categoryService.updateCategory(category.id, { name }));
      this.editingCategoryId.set(null);
      this.notifications.success(`Categoria “${name}” atualizada com sucesso.`);
      this.categoriesChanged.emit();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível editar a categoria.'),
      );
    }
  }

  protected async removeCategory(category: Category): Promise<void> {
    this.clearError();
    if (!window.confirm(`Excluir a categoria “${category.name}”?`)) return;

    try {
      await firstValueFrom(this.categoryService.deleteCategory(category.id));
      this.notifications.success(`Categoria “${category.name}” excluída com sucesso.`);
      this.categoriesChanged.emit();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível excluir a categoria.'),
      );
    }
  }
}
