import { Component, input, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { ReviewFormModalComponent } from '../review-form-modal/review-form-modal.component';
import { ReviewsSkeletonComponent } from '../reviews-skeleton/reviews-skeleton.component';
import { Review } from '../../../../core/models/review';
import { ReviewService } from '../../../../core/services/review.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReviewCardComponent, ReviewFormModalComponent, ReviewsSkeletonComponent],
  template: `
    <section class="mt-12 border-t border-outline-variant pt-8">
      <div class="container mx-auto px-4 max-w-5xl">

        <!-- Loading State -->
        @if (isLoading()) {
          <app-reviews-skeleton />
        }

        <!-- Empty State (Screen 05) -->
        @if (!isLoading() && reviews().length === 0) {
          <div class="text-center py-16">
            <div class="w-16 h-16 mx-auto mb-4 bg-surface-container-high rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-3xl text-on-surface-variant">rate_review</span>
            </div>
            <h3 class="font-headline text-lg text-on-surface mb-2">Sin opiniones aún</h3>
            <p class="text-on-surface-variant text-sm max-w-md mx-auto mb-6">
              Sé el primero en compartir tu experiencia con este producto. Tu opinión ayuda a otros compradores a tomar mejores decisiones.
            </p>
            @if (isAuthenticated()) {
              <button
                type="button"
                (click)="openWriteModal()"
                class="iris-gradient-bg iris-glow-hover px-6 py-2.5 rounded-button text-on-primary font-medium text-sm inline-flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-lg">edit</span>
                Sé el primero en opinar
              </button>
            } @else {
              <p class="text-on-surface-variant text-xs">
                ¿Ya compraste este producto?
                <a routerLink="/auth" [queryParams]="{returnUrl: '/product/' + productId()}" class="text-primary hover:underline">Inicia sesión</a>
                para dejar tu opinión.
              </p>
            }
          </div>
        }

        <!-- Reviews Content (Screens 01-03) -->
        @if (!isLoading() && reviews().length > 0) {
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 class="font-headline text-headline-md font-semibold text-on-surface">Opiniones de Clientes</h3>

            <!-- Write Review Button -->
            @if (isAuthenticated() && !userHasReview()) {
              <button
                type="button"
                (click)="openWriteModal()"
                class="iris-gradient-bg iris-glow-hover px-5 py-2.5 rounded-button text-on-primary font-medium text-sm inline-flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-lg">edit</span>
                Escribir opinión
              </button>
            } @else if (!isAuthenticated()) {
              <a
                routerLink="/auth"
                [queryParams]="{returnUrl: '/product/' + productId()}"
                class="opacity-60 cursor-not-allowed px-5 py-2.5 rounded-button bg-surface-container-high text-on-surface-variant font-medium text-sm inline-flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-lg">edit</span>
                Escribir opinión
              </a>
            }
          </div>

          <!-- Aggregate Rating Card (Screen 01-03 design) -->
          <div class="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-surface-card rounded-card border border-outline-variant">
            <!-- Left: Big Rating Number -->
            <div class="text-center md:text-left md:pr-8 md:border-r md:border-outline-variant">
              <div class="text-6xl font-bold text-on-surface mb-2">{{ averageRating() }}</div>
              <div class="flex items-center justify-center md:justify-start gap-0.5 mb-1">
                @for (i of [1,2,3,4,5]; track i) {
                  <span
                    class="material-symbols-outlined text-xl"
                    [class.text-star]="i <= Math.round(averageRating())"
                    [class.text-on-surface-variant]="i > Math.round(averageRating())"
                    [style.font-variation-settings]="i <= Math.round(averageRating()) ? 'FILL 1, wght 400, GRAD 0, opsz 24' : 'FILL 0, wght 400, GRAD 0, opsz 24'"
                  >star</span>
                }
              </div>
              <span class="text-on-surface-variant text-sm">Basado en {{ reviews().length }} opiniones</span>
            </div>

            <!-- Right: Distribution Bars -->
            <div class="flex-1 space-y-3">
              @for (i of [5,4,3,2,1]; track i) {
                <div class="flex items-center gap-3">
                  <span class="text-on-surface-variant text-xs w-8">{{ i }} ★</span>
                  <div class="flex-1 h-3 bg-surface-container-high rounded-pill overflow-hidden">
                    <div
                      class="h-full bg-star rounded-pill transition-all duration-300"
                      [style.width.%]="getDistributionPercentage(i)"
                    ></div>
                  </div>
                  <span class="text-on-surface-variant text-xs w-10 text-right">{{ getDistributionCount(i) }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Sort Bar (Screen 06: native select with chevron) -->
          <div class="flex items-center justify-between mb-6">
            <span class="text-on-surface-variant text-sm">{{ reviews().length }} opiniones</span>
            <div class="relative">
              <select
                [ngModel]="sort()"
                (ngModelChange)="setSort($event)"
                class="appearance-none px-4 py-2 pr-10 rounded-button border border-outline-variant bg-surface-card text-on-surface text-sm cursor-pointer hover:bg-surface-container-high transition-colors focus:outline-none focus:border-primary"
                style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27%239e9e9e%27%3E%3Cpath d=%27M7 10l5 5 5-5z%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 12px center;"
              >
                <option value="newest">Más recientes</option>
                <option value="highest">Mejor evaluados</option>
                <option value="lowest">Peor evaluados</option>
              </select>
            </div>
          </div>

          <!-- User's Own Review (Highlighted — Screen 03) -->
          @if (userReview()) {
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-lg text-primary">person</span>
                <span class="text-primary font-medium text-xs">Tu opinión</span>
              </div>
              <div class="bg-primary/5 border border-primary/30 rounded-card">
                <app-review-card
                  [review]="userReview()!"
                  [isOwnReview]="true"
                  [sellerReplies]="sellerReplies()"
                  (edit)="openEditModal(userReview()!)"
                  (delete)="confirmDelete(userReview()!)"
                />
              </div>
            </div>
          }

          <!-- Other Reviews -->
          <div class="space-y-4">
            @for (review of sortedReviews(); track review.id) {
              @if (review.id !== userReview()?.id) {
                <app-review-card
                  [review]="review"
                  [isOwnReview]="false"
                  [sellerReplies]="sellerReplies()"
                />
              }
            }
          </div>
        }
      </div>
    </section>

    <!-- Write/Edit Modal (Screen 04) -->
    @if (showFormModal()) {
      <app-review-form-modal
        [product]="productName()"
        (submit)="onSubmitReview($event)"
        (cancel)="closeFormModal()"
      />
    }

    <!-- Delete Confirmation Dialog (Screen 08) -->
    @if (showDeleteDialog()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" (click)="cancelDelete()"></div>

      <!-- Dialog -->
      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 max-w-[440px] w-full bg-surface-card rounded-modal border border-outline-variant shadow-2xl">
        <!-- Header -->
        <div class="flex items-center gap-3 px-6 py-4 border-b border-outline-variant">
          <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
            <span class="material-symbols-outlined text-on-error-container">warning</span>
          </div>
          <div>
            <h3 class="font-headline text-lg font-semibold text-on-surface">Eliminar opinión</h3>
            <p class="text-on-surface-variant text-xs">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-5">
          <p class="text-on-surface text-sm mb-4">
            ¿Estás seguro de que deseas eliminar tu opinión? El historial de calificación del producto se actualizará.
          </p>

          @if (reviewToDelete()) {
            <div class="p-3 bg-surface-container-low rounded-card border border-outline-variant">
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center gap-1">
                  @for (i of [1,2,3,4,5]; track i) {
                    <span
                      class="material-symbols-outlined text-sm"
                      [class.text-star]="i <= reviewToDelete()!.rating"
                      [class.text-on-surface-variant]="i > reviewToDelete()!.rating"
                      [style.font-variation-settings]="i <= reviewToDelete()!.rating ? 'FILL 1, wght 400, GRAD 0, opsz 24' : 'FILL 0, wght 400, GRAD 0, opsz 24'"
                    >star</span>
                  }
                </div>
                @if (reviewToDelete()!.title) {
                  <span class="text-on-surface text-xs font-medium">{{ reviewToDelete()!.title }}</span>
                }
              </div>
              <p class="text-on-surface-variant text-xs line-clamp-2">{{ reviewToDelete()!.comment }}</p>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant">
          <button
            type="button"
            (click)="cancelDelete()"
            class="text-on-surface-variant text-sm font-medium px-4 py-2.5 rounded-button hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            (click)="onDeleteConfirm()"
            class="bg-error text-on-error-container text-sm font-medium px-6 py-2.5 rounded-button hover:bg-error/90 transition-colors flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
            Eliminar opinión
          </button>
        </div>
      </div>
    }
  `,
  styles: []
})
export class ReviewsSectionComponent {
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  /** Product ID to load reviews for */
  readonly productId = input.required<string>();

  /** Product name for modal context */
  readonly productName = input<string>('');

  /** Math reference for template */
  readonly Math = Math;

  /** Loading state */
  readonly isLoading = signal(true);

  /** Reviews list */
  readonly reviews = signal<Review[]>([]);

  /** Seller replies */
  readonly sellerReplies = signal<any[]>([]);

  /** Sort option */
  readonly sort = signal<string>('newest');

  /** Show write/edit modal */
  readonly showFormModal = signal(false);

  /** Show delete confirmation dialog */
  readonly showDeleteDialog = signal(false);

  /** Review being edited */
  readonly editingReview = signal<Review | null>(null);

  /** Review to delete */
  readonly reviewToDelete = signal<Review | null>(null);

  /** Auth state */
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  /** Current user ID */
  private readonly currentUserId = computed(() => this.authService.currentUser()?.id || '');

  /** User's own review */
  readonly userReview = computed(() => {
    const userId = this.currentUserId();
    return this.reviews().find(r => r.authorId === userId) || null;
  });

  /** Whether user already has a review */
  readonly userHasReview = computed(() => this.userReview() !== null);

  /** Average rating */
  readonly averageRating = computed(() => {
    const reviews = this.reviews();
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, r) => total + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  });

  /** Sorted reviews */
  readonly sortedReviews = computed(() => {
    const reviews = [...this.reviews()];
    const sortValue = this.sort();

    switch (sortValue) {
      case 'highest':
        return reviews.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return reviews.sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  });

  constructor() {
    effect(() => {
      const id = this.productId();
      if (id) {
        this.loadReviews(id);
      }
    });
  }

  private loadReviews(productId: string): void {
    this.isLoading.set(true);
    this.reviewService.getReviewsByProduct(productId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.loadSellerReplies();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private loadSellerReplies(): void {
    this.reviewService.getSellerReplies().subscribe({
      next: (replies) => {
        this.sellerReplies.set(replies);
      },
      error: () => {
        this.sellerReplies.set([]);
      },
    });
  }

  getDistributionCount(stars: number): number {
    return this.reviews().filter(r => r.rating === stars).length;
  }

  getDistributionPercentage(stars: number): number {
    const count = this.getDistributionCount(stars);
    const total = this.reviews().length;
    return total > 0 ? (count / total) * 100 : 0;
  }

  setSort(value: string): void {
    this.sort.set(value);
  }

  openWriteModal(): void {
    this.editingReview.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(review: Review): void {
    this.editingReview.set(review);
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.editingReview.set(null);
  }

  confirmDelete(review: Review): void {
    this.reviewToDelete.set(review);
    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.reviewToDelete.set(null);
  }

  onSubmitReview(data: { rating: number; title?: string; comment: string }): void {
    const productId = this.productId();
    const editing = this.editingReview();

    if (editing) {
      this.reviewService.updateReview(editing.id, {
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      }).subscribe({
        next: () => {
          this.toastService.success('Opinión actualizada exitosamente.');
          this.closeFormModal();
          this.loadReviews(productId);
        },
        error: () => {
          this.toastService.error('No se pudo actualizar la opinión. Intenta de nuevo.');
        },
      });
    } else {
      this.reviewService.addReview(productId, {
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      }).subscribe({
        next: () => {
          this.toastService.success(`Tu opinión sobre ${this.productName()} ha sido publicada exitosamente.`);
          this.closeFormModal();
          this.loadReviews(productId);
        },
        error: () => {
          this.toastService.error('No se pudo publicar la opinión. Intenta de nuevo.');
        },
      });
    }
  }

  onDeleteConfirm(): void {
    const review = this.reviewToDelete();
    if (!review) return;

    this.reviewService.deleteReview(review.id, this.productId()).subscribe({
      next: () => {
        this.toastService.success('Tu opinión ha sido eliminada exitosamente.');
        this.cancelDelete();
        this.loadReviews(this.productId());
      },
      error: () => {
        this.toastService.error('No se pudo eliminar la opinión. Intenta de nuevo.');
      },
    });
  }
}
