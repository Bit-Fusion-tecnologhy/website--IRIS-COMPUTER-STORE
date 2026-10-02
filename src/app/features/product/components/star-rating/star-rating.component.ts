import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [],
  template: `
    <span class="flex items-center gap-0.5">
      @for (i of [1,2,3,4,5]; track i) {
        @if (interactive()) {
          <button
            type="button"
            class="p-0.5 hover:scale-110 transition-transform"
            (click)="onClick(i)"
            [attr.aria-label]="i + ' estrella'"
          >
            <span
              class="material-symbols-outlined text-xl"
              [class.text-star]="i <= ratingValue()"
              [class.text-on-surface-variant]="i > ratingValue()"
              [style.font-variation-settings]="i <= ratingValue() ? 'FILL 1, wght 400, GRAD 0, opsz 24' : 'FILL 0, wght 400, GRAD 0, opsz 24'"
            >star</span>
          </button>
        } @else {
          <span
            class="material-symbols-outlined text-xl select-none"
            [class.text-star]="i <= ratingValue()"
            [class.text-on-surface-variant]="i > ratingValue()"
            [style.font-variation-settings]="i <= ratingValue() ? 'FILL 1, wght 400, GRAD 0, opsz 24' : 'FILL 0, wght 400, GRAD 0, opsz 24'"
          >star</span>
        }
      }
      @if (interactive() && ratingValue() > 0) {
        <span class="text-xs text-on-surface-variant ml-1">{{ ratingValue() }} de 5</span>
      }
    </span>
  `,
  styles: []
})
export class StarRatingComponent {
  /** Rating value 1-5, or 0 if no selection (from input) */
  readonly rating = input<number>(0);

  /** Whether the stars are clickable/interactive */
  readonly interactive = input<boolean>(false);

  /** Emitted when user clicks a star in interactive mode */
  readonly ratingChange = output<number>();

  /** Internal writable signal for rating state */
  readonly ratingValue = signal<number>(this.rating());

  /** Sets the selected rating and emits the event */
  onClick(index: number): void {
    this.ratingValue.set(index);
    this.ratingChange.emit(index);
  }
}
