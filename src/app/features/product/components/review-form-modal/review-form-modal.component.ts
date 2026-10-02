import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      (click)="onBackdropClick()"
    ></div>

    <!-- Modal Panel -->
    <aside
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 max-w-[520px] w-[calc(100%-2rem)] bg-surface-card rounded-modal border border-outline-variant shadow-2xl"
      (click)="$event.stopPropagation()"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
        <h2 class="font-headline text-lg font-semibold text-on-surface">Escribir opinión</h2>
        <button
          type="button"
          (click)="onCancel()"
          class="text-on-surface-variant hover:bg-surface-container-high rounded-full p-1.5 transition-colors"
          aria-label="Cerrar"
        >
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      <!-- Product Context -->
      @if (product()) {
        <div class="mx-6 mt-4 p-3 bg-surface-container-low rounded-card border border-outline-variant">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-surface-container-high rounded-card flex items-center justify-center">
              <span class="material-symbols-outlined text-on-surface-variant text-xl">memory</span>
            </div>
            <span class="text-on-surface text-sm font-medium">{{ product() }}</span>
          </div>
        </div>
      }

      <!-- Form Body -->
      <div class="px-6 py-5">
        <!-- Star Rating Input -->
        <div class="mb-5">
          <label class="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Calificación</label>
          <div class="flex items-center gap-1">
            @for (i of [1,2,3,4,5]; track i) {
              <button
                type="button"
                (click)="setRating(i)"
                class="p-0.5 hover:scale-110 transition-transform"
                [attr.aria-label]="i + ' estrella'"
              >
                <span
                  class="material-symbols-outlined text-2xl"
                  [class.text-star]="i <= rating()"
                  [class.text-on-surface-variant]="i > rating() && !submitted()"
                  [class.text-error]="i > rating() && submitted() && rating() === 0"
                  [style.font-variation-settings]="i <= rating() ? 'FILL 1, wght 400, GRAD 0, opsz 24' : 'FILL 0, wght 400, GRAD 0, opsz 24'"
                >star</span>
              </button>
            }
            @if (rating() > 0) {
              <span class="text-xs text-on-surface-variant ml-2">{{ rating() }} de 5</span>
            }
          </div>
          @if (submitted() && rating() === 0) {
            <p class="text-error text-xs mt-1">Selecciona una calificación</p>
          }
        </div>

        <!-- Title Input (Optional) -->
        <div class="mb-4">
          <label class="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Título (opcional)</label>
          <input
            type="text"
            class="w-full rounded-card border border-outline-variant bg-surface-card px-3 py-2.5 text-on-surface text-sm outline-none focus:border-primary transition-colors"
            placeholder="Resumen corto de tu experiencia"
            [ngModel]="title()"
            (ngModelChange)="title.set($event)"
          />
        </div>

        <!-- Comment Textarea -->
        <div class="mb-5">
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-on-surface-variant uppercase tracking-wider font-medium">Comentario</label>
            <span
              class="text-xs"
              [class.text-error]="comment().length > 0 && comment().length < 10"
              [class.text-on-surface-variant]="comment().length === 0 || comment().length >= 10"
            >
              {{ comment().length }} / 10 mín
            </span>
          </div>
          <textarea
            rows="4"
            class="w-full rounded-card px-3 py-2.5 text-on-surface text-sm outline-none resize-none transition-colors"
            [class.border-error]="(comment().length > 0 && comment().length < 10) || (submitted() && comment().length < 10)"
            [class.border-outline-variant]="comment().length === 0 || comment().length >= 10"
            [class.bg-surface-card]="true"
            [ngModel]="comment()"
            (ngModelChange)="onCommentChange($event)"
            placeholder="Cuéntanos tu experiencia con el producto..."
          ></textarea>
          @if (comment().length > 0 && comment().length < 10) {
            <p class="text-error text-xs mt-1">Mínimo 10 caracteres (faltan {{ 10 - comment().length }})</p>
          } @else if (submitted() && comment().length < 10) {
            <p class="text-error text-xs mt-1">El comentario es obligatorio (mínimo 10 caracteres)</p>
          }
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center gap-3 px-6 py-4 border-t border-outline-variant">
        <button
          type="button"
          (click)="onCancel()"
          class="flex-1 text-on-surface-variant text-sm font-medium px-4 py-2.5 rounded-button border border-outline-variant hover:bg-surface-container-high transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          (click)="onSubmit()"
          class="flex-1 iris-gradient-bg text-on-primary text-sm font-medium px-6 py-2.5 rounded-button transition-all hover:brightness-110"
        >
          Publicar opinión
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .border-error {
      border-color: var(--color-error) !important;
    }
  `]
})
export class ReviewFormModalComponent {
  /** Product name for context */
  readonly product = input<string>('');

  /** Rating selection 1-5, 0 if none selected */
  readonly rating = signal<number>(0);

  /** Title input value */
  readonly title = signal<string>('');

  /** Comment input value */
  readonly comment = signal<string>('');

  /** Whether submit was attempted (for showing validation errors) */
  readonly submitted = signal<boolean>(false);

  /** Emitted when form is submitted */
  readonly submit = output<{ rating: number; title?: string; comment: string }>();

  /** Emitted when modal is cancelled */
  readonly cancel = output<void>();

  /** Whether form is valid */
  readonly isValid = computed(() => {
    const hasRating = this.rating() > 0;
    const hasComment = this.comment().length >= 10;
    return hasRating && hasComment;
  });

  /** Sets the selected rating */
  setRating(rating: number): void {
    this.rating.set(rating);
  }

  /** Handles comment change */
  onCommentChange(value: string): void {
    this.comment.set(value);
  }

  /** Handles submit action */
  onSubmit(): void {
    this.submitted.set(true);

    if (!this.isValid()) return;

    this.submit.emit({
      rating: this.rating(),
      title: this.title() || undefined,
      comment: this.comment(),
    });
    this.cancel.emit();
  }

  /** Handles backdrop click (close modal) */
  onBackdropClick(): void {
    this.onCancel();
  }

  /** Handles cancel action */
  onCancel(): void {
    this.comment.set('');
    this.rating.set(0);
    this.title.set('');
    this.submitted.set(false);
    this.cancel.emit();
  }
}
