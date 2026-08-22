import { Component, forwardRef, inject, input, OnDestroy, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';

import { FileSizePipe } from '../../pipes/file-size.pipe';
import { Imgbb } from '../../services/imgbb';

const MAX_FILE_SIZE = 32 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@Component({
  selector: 'app-image-upload',
  imports: [ButtonModule, FileSizePipe],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUpload),
      multi: true,
    },
  ],
})
export class ImageUpload implements ControlValueAccessor, OnDestroy {
  private readonly imgbb = inject(Imgbb);
  private uploadSequence = 0;
  private objectUrl: string | null = null;
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly uploadingChange = output<boolean>();
  readonly title = input('Comprovante do pagamento');
  readonly description = input('Envie um print do Pix para confirmar o pagamento de 20%.');
  readonly selectLabel = input('Selecionar print do Pix');
  readonly previewAlt = input('Pré-visualização da imagem enviada');
  readonly inputId = input('image-upload');

  protected readonly file = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly uploadedUrl = signal<string | null>(null);
  protected readonly uploading = signal(false);
  protected readonly uploadError = signal<string | null>(null);
  protected readonly disabled = signal(false);

  writeValue(value: string | null): void {
    this.uploadedUrl.set(value);

    if (value === null && this.file()) {
      this.revokePreview();
      this.file.set(null);
      this.setUploading(false);
      this.uploadError.set(null);
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.onTouched();

    if (!ACCEPTED_FILE_TYPES.has(file.type)) {
      this.rejectFile(input, 'Selecione uma imagem JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.rejectFile(input, 'A imagem deve ter no máximo 32 MB.');
      return;
    }

    this.uploadSequence++;
    this.setFile(file);
    this.updateValue(null);
    this.uploadError.set(null);
  }

  protected openFilePicker(input: HTMLInputElement): void {
    if (this.disabled()) return;

    input.value = '';
    input.click();
  }

  async uploadPendingFile(): Promise<string | null> {
    const file = this.file();
    const existingUrl = this.uploadedUrl();
    if (!file || existingUrl) {
      return existingUrl;
    }

    const uploadSequence = ++this.uploadSequence;
    this.setUploading(true);
    this.uploadError.set(null);

    try {
      const response = await firstValueFrom(this.imgbb.uploadImage(file));
      if (uploadSequence !== this.uploadSequence) {
        return this.uploadedUrl();
      }

      const imageUrl = response.success ? response.data?.url : null;
      if (!imageUrl) {
        this.finishWithError('Não foi possível obter o link da imagem.');
        throw new Error('Image upload did not return a URL.');
      }

      this.updateValue(imageUrl);
      this.setUploading(false);
      return imageUrl;
    } catch (error: unknown) {
      if (uploadSequence === this.uploadSequence && !this.uploadError()) {
        this.finishWithError('Falha ao enviar a imagem. Tente novamente.');
      }
      throw error;
    }
  }

  protected removeFile(input: HTMLInputElement): void {
    this.uploadSequence++;
    input.value = '';
    this.clearFile();
    this.onTouched();
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  private setFile(file: File): void {
    this.revokePreview();
    this.file.set(file);
    this.objectUrl = URL.createObjectURL(file);
    this.previewUrl.set(this.objectUrl);
  }

  private rejectFile(input: HTMLInputElement, message: string): void {
    this.uploadSequence++;
    input.value = '';
    this.clearFile();
    this.uploadError.set(message);
  }

  private clearFile(): void {
    this.revokePreview();
    this.file.set(null);
    this.setUploading(false);
    this.uploadError.set(null);
    this.updateValue(null);
  }

  private finishWithError(message: string): void {
    this.setUploading(false);
    this.uploadError.set(message);
    this.updateValue(null);
  }

  private updateValue(value: string | null): void {
    this.uploadedUrl.set(value);
    this.onChange(value);
  }

  private setUploading(uploading: boolean): void {
    this.uploading.set(uploading);
    this.uploadingChange.emit(uploading);
  }

  private revokePreview(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.previewUrl.set(null);
  }
}
