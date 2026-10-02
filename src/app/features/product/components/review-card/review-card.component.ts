import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../../../core/models/review';

/** Color palette for user avatars — deterministic by name hash */
const AVATAR_COLORS = [
  '#3f51b5', '#f44336', '#009688', '#ff9800', '#9c27b0',
  '#2196f3', '#e91e63', '#4caf50', '#ff5722', '#607d8b',
];

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="p-5 bg-surface-card rounded-card border border-outline-variant">
      <!-- Header: Avatar + Name + Stars -->
      <div class="flex items-center gap-3 mb-3">
        <!-- Avatar with initials -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          [style.background]="getAvatarColor(review().authorName)"
        >
          <span class="text-sm font-bold text-white">{{ getInitials(review().authorName) }}</span>
        </div>

        <!-- Name + verified badge -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-on-surface text-sm font-medium truncate">{{ review().authorName }}</span>
            @if (isOwnReview()) {
              <span class="text-xs text-primary font-medium">Tú</span>
            }
            @if (hasVerifiedPurchase()) {
              <span class="inline-flex items-center gap-1 text-xs font-medium rounded-full bg-accent-cyan/15 text-accent-cyan px-2 py-0.5">
                <span class="material-symbols-outlined text-xs">verified</span>
                Compra verificada
              </span>
            }
          </div>
          <span class="text-on-surface-variant text-xs">{{ formatDate(review().createdAt) }}</span>
        </div>

        <!-- Stars -->
        <div class="flex items-center gap-0.5 shrink-0">
          @for (i of [1,2,3,4,5]; track i) {
            <span
              class="material-symbols-outlined text-base"
              [class.text-star]="i <= review().rating"
              [class.text-on-surface-variant]="i > review().rating"
              [style.font-variation-settings]="i <= review().rating ? 'FILL 1, wght 400, GRAD 0, opsz 24' : 'FILL 0, wght 400, GRAD 0, opsz 24'"
            >star</span>
          }
        </div>

        <!-- Edit/Delete for own review -->
        @if (isOwnReview()) {
          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              (click)="edit.emit()"
              class="text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
              aria-label="Editar reseña"
            >
              <span class="material-symbols-outlined text-lg">edit</span>
            </button>
            <button
              type="button"
              (click)="delete.emit()"
              class="text-on-surface-variant hover:text-error p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
              aria-label="Eliminar reseña"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        }
      </div>

      <!-- Title -->
      @if (review().title) {
        <h4 class="text-on-surface font-medium text-sm mb-2">{{ review().title }}</h4>
      }

      <!-- Comment -->
      <p class="text-on-surface-variant text-sm leading-relaxed mb-3">{{ review().comment }}</p>

      <!-- Action buttons: Útil + Reportar -->
      @if (!isOwnReview()) {
        <div class="flex items-center gap-4 text-xs text-on-surface-variant">
          <button
            type="button"
            (click)="onUsefulClick()"
            class="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <span class="material-symbols-outlined text-sm">thumb_up</span>
            Útil ({{ usefulCount() }})
          </button>
          <button
            type="button"
            (click)="onReportClick()"
            class="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <span class="material-symbols-outlined text-sm">flag</span>
            Reportar
          </button>
        </div>
      }

      <!-- Seller Reply -->
      @if (getSellerReply()) {
        <div class="mt-4 ml-6 pl-4 border-l-2 border-primary/40 bg-surface-container-low/50 rounded-r-card p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-sm text-on-primary-container">storefront</span>
            </div>
            <div>
              <span class="text-primary font-medium text-xs">Respuesta de Iris Computer</span>
              <span class="text-on-surface-variant text-xs ml-1">· {{ formatDate(getSellerReply()!.createdAt) }}</span>
            </div>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">{{ getSellerReply()!.comment }}</p>
        </div>
      }
    </article>
  `,
  styles: []
})
export class ReviewCardComponent {
  /** Review data to display */
  readonly review = input.required<Review>();

  /** Whether this is the current user's review */
  readonly isOwnReview = input<boolean>(false);

  /** Seller replies list */
  readonly sellerReplies = input<any[]>([]);

  /** Emitted when edit is clicked */
  readonly edit = output<void>();

  /** Emitted when delete is clicked */
  readonly delete = output<void>();

  /** Local useful count (prototype: random 1-15) */
  readonly usefulCount = signal(Math.floor(Math.random() * 15) + 1);

  /** Check if review has verified purchase */
  readonly hasVerifiedPurchase = computed(() => {
    // For prototype, all reviews are verified purchases
    return true;
  });

  /** Get seller reply for this review */
  getSellerReply(): any {
    const replies = this.sellerReplies();
    return replies.find((reply: any) => reply.reviewId === this.review().id) || null;
  }

  /** Get initials from name (e.g. "Carlos Mendoza" → "CM") */
  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  /** Get deterministic avatar color from name */
  getAvatarColor(name: string): string {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  /** Format date to Spanish locale */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;

      const day = date.getDate();
      const month = date.toLocaleString('es-ES', { month: 'short' });
      const year = date.getFullYear();
      return `${day} de ${month} de ${year}`;
    } catch {
      return dateString;
    }
  }

  /** Handle useful button click */
  onUsefulClick(): void {
    this.usefulCount.update(v => v + 1);
  }

  /** Handle report button click (prototype: no-op) */
  onReportClick(): void {
    // Prototype: no-op
  }
}
