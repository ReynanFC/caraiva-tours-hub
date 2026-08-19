import { Component, computed, debounced, inject, resource, signal, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';

import { SessionStore } from '../../../../core/auth/session/session-store';
import { Tour } from '../../model/tour.model';
import { emptyTourForm, tourFormToRequest, tourToForm } from '../../model/tour-form.model';
import { Category as CategoryService } from '../../service/category';
import { TourCardGrid } from '../../components/tour-card-grid/tour-card-grid';
import { ToursListFilters } from '../../components/tours-list-filters/tours-list-filters';
import { Tours } from '../../service/tours';
import { ImageUpload } from '../../../../shared/components/image-upload/image-upload';
import { Input } from '../../../../shared/components/input/input';
import { CategoryDialog } from '../../components/category-dialog/category-dialog';
import { ActionNotificationService } from '../../../../shared/components/action-notification/action-notification.service';
import { getApiErrorMessage } from '../../../../core/http/api-error';

function promotionalPriceNotGreaterThanBase(control: AbstractControl): ValidationErrors | null {
  const basePrice = control.get('basePricePerPerson')?.value;
  const promotionalPrice = control.get('promoPricePerPerson')?.value;

  return typeof basePrice === 'number' &&
    typeof promotionalPrice === 'number' &&
    promotionalPrice > basePrice
    ? { promotionalPriceGreaterThanBase: true }
    : null;
}

function createTourForm(): FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  basePricePerPerson: FormControl<number>;
  promoPricePerPerson: FormControl<number>;
  commissionType: FormControl<'PERCENTAGE' | 'FIXED'>;
  commissionValue: FormControl<number>;
  duration: FormGroup<{ hours: FormControl<number>; minutes: FormControl<number> }>;
  available: FormControl<boolean>;
  imageUrl: FormControl<string>;
  isPromotional: FormControl<boolean>;
  categoryTourId: FormControl<number>;
}> {
  const value = emptyTourForm();
  return new FormGroup(
    {
      name: new FormControl(value.name, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      description: new FormControl(value.description, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(1000)],
      }),
      basePricePerPerson: new FormControl(value.basePricePerPerson, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      promoPricePerPerson: new FormControl(value.promoPricePerPerson, {
        nonNullable: true,
        validators: [Validators.min(0)],
      }),
      commissionType: new FormControl(value.commissionType, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      commissionValue: new FormControl(value.commissionValue, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      duration: new FormGroup({
        hours: new FormControl(value.duration.hours, {
          nonNullable: true,
          validators: [Validators.min(0), Validators.max(999)],
        }),
        minutes: new FormControl(value.duration.minutes, {
          nonNullable: true,
          validators: [Validators.min(0), Validators.max(59)],
        }),
      }),
      available: new FormControl(value.available, { nonNullable: true }),
      imageUrl: new FormControl(value.imageUrl, {
        nonNullable: true,
        validators: [Validators.maxLength(255)],
      }),
      isPromotional: new FormControl(value.isPromotional, { nonNullable: true }),
      categoryTourId: new FormControl(value.categoryTourId, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
    },
    { validators: promotionalPriceNotGreaterThanBase },
  );
}

@Component({
  selector: 'app-tours-list',
  imports: [
    ButtonModule,
    CategoryDialog,
    CheckboxModule,
    ImageUpload,
    Input,
    PIcon,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
    TourCardGrid,
    ToursListFilters,
  ],
  templateUrl: './tours-list.html',
  styleUrl: './tours-list.css',
})
export class ToursList {
  private readonly toursService = inject(Tours);
  private readonly categoryService = inject(CategoryService);
  private readonly sessionStore = inject(SessionStore);
  private readonly notifications = inject(ActionNotificationService);
  private readonly imageUpload = viewChild.required(ImageUpload);

  protected readonly isAdmin = this.sessionStore.isAdmin;
  protected readonly search = signal('');
  protected readonly page = signal(0);
  protected readonly selectedCategoryId = signal<number | undefined>(undefined);
  protected readonly categoriesOpen = signal(false);
  protected readonly editorOpen = signal(false);
  protected readonly editingTour = signal<Tour | null>(null);
  protected readonly tourForm = createTourForm();
  protected readonly saving = signal(false);
  protected readonly pageSize = 6;
  protected readonly commissionTypes = [
    { label: 'Percentual', value: 'PERCENTAGE' },
    { label: 'Valor fixo', value: 'FIXED' },
  ];
  private readonly debouncedSearch = debounced(this.search, 700);

  protected readonly categoriesResource = resource({
    loader: () => firstValueFrom(this.categoryService.getCategories('', 0, 50)),
  });

  protected readonly toursResource = resource({
    params: () => ({
      search: this.debouncedSearch.value(),
      page: this.page(),
      categoryId: this.selectedCategoryId(),
    }),
    loader: ({ params }) =>
      firstValueFrom(
        this.toursService.getTours(params.search, params.page, this.pageSize, params.categoryId),
      ),
  });

  protected readonly categories = computed(() =>
    this.categoriesResource.hasValue() ? this.categoriesResource.value().content : [],
  );
  protected readonly totalTours = computed(() =>
    this.categories().reduce((total, category) => total + category.tourCount, 0),
  );
  protected readonly currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  protected changeSearch(value: string): void {
    this.page.set(0);
    this.search.set(value);
  }

  protected selectCategory(categoryId?: number): void {
    this.page.set(0);
    this.selectedCategoryId.set(categoryId);
  }

  protected selectOverflowCategory(value: string): void {
    this.selectCategory(value ? Number(value) : undefined);
  }

  protected previousPage(): void {
    this.page.update((current) => Math.max(0, current - 1));
  }

  protected nextPage(): void {
    const totalPages = this.toursResource.value()?.totalPages ?? 0;
    this.page.update((current) => Math.min(current + 1, Math.max(totalPages - 1, 0)));
  }

  protected async toggleAvailability(tour: Tour): Promise<void> {
    this.notifications.clear();
    try {
      await firstValueFrom(this.toursService.setAvailableTour(tour.id, !tour.available));
      this.notifications.success(
        `Passeio “${tour.name}” ${tour.available ? 'indisponibilizado' : 'disponibilizado'} com sucesso.`,
      );
      this.toursResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível alterar a disponibilidade do passeio.'),
      );
    }
  }

  protected openCreateTour(): void {
    this.editingTour.set(null);
    this.tourForm.reset(emptyTourForm());
    this.notifications.clear();
    this.editorOpen.set(true);
  }

  protected openEditTour(tour: Tour): void {
    this.editingTour.set(tour);
    this.tourForm.reset(tourToForm(tour));
    this.notifications.clear();
    this.editorOpen.set(true);
  }

  protected async saveTour(): Promise<void> {
    if (this.tourForm.invalid) {
      this.tourForm.markAllAsTouched();
      return;
    }
    const request = tourFormToRequest(this.tourForm.getRawValue());
    if (!request) {
      this.notifications.error('Informe uma duração maior que zero.');
      return;
    }

    this.saving.set(true);
    this.notifications.clear();
    try {
      const imageUrl = await this.imageUpload().uploadPendingFile();
      this.tourForm.controls.imageUrl.setValue(imageUrl ?? '');
      const requestWithImage = tourFormToRequest(this.tourForm.getRawValue());
      if (!requestWithImage) return;

      const tour = this.editingTour();
      if (tour) await firstValueFrom(this.toursService.updateTour(tour.id, requestWithImage));
      else await firstValueFrom(this.toursService.createTour(requestWithImage));
      this.editorOpen.set(false);
      this.notifications.success(
        tour ? `Passeio “${tour.name}” atualizado com sucesso.` : 'Passeio criado com sucesso.',
      );
      this.toursResource.reload();
      this.categoriesResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível salvar o passeio.'),
      );
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeTour(tour: Tour): Promise<void> {
    if (!window.confirm(`Excluir o passeio “${tour.name}”?`)) return;
    this.notifications.clear();
    try {
      await firstValueFrom(this.toursService.deleteTour(tour.id));
      this.notifications.success(`Passeio “${tour.name}” excluído com sucesso.`);
      this.toursResource.reload();
      this.categoriesResource.reload();
    } catch (error: unknown) {
      this.notifications.error(
        await getApiErrorMessage(error, 'Não foi possível excluir o passeio.'),
      );
    }
  }

  protected priceFor(tour: Tour): number {
    return tour.isPromotional && tour.promoPricePerPerson
      ? tour.promoPricePerPerson
      : tour.basePricePerPerson;
  }

  protected commissionFor(tour: Tour): string {
    return tour.commissionType === 'PERCENTAGE'
      ? `${tour.commissionValue}%`
      : this.currency.format(tour.commissionValue);
  }
}
