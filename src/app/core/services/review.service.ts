import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, map } from 'rxjs';
import { Review } from '../models/review';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Obtiene las reseñas para un producto específico
   */
  getReviewsByProduct(productId: string): Observable<Review[]> {
    // NOTE: _order=desc is removed because JSON Server 1.0.0-beta.15 has a bug
    // where _order breaks filtering and returns []. Sorting is handled client-side
    // in ReviewsSectionComponent.sortedReviews().
    return this.http.get<Review[]>(`${this.apiUrl}/reviews?productId=${productId}`).pipe(
      catchError((error) => {
        console.error('Error fetching reviews:', error);
        return of([]);
      })
    );
  }

  /**
   * Agrega una nueva reseña usando el usuario autenticado real
   */
  addReview(productId: string, review: { rating: number; title?: string; comment: string }): Observable<Review> {
    const user = this.authService.currentUser();

    const payload = {
      ...review,
      productId,
      authorId: user?.id || 'anonymous',
      authorName: user?.fullName || 'Anónimo',
      createdAt: new Date().toISOString(),
    };

    return this.http.post<Review>(`${this.apiUrl}/reviews`, payload).pipe(
      switchMap((created) => {
        // Sync product averageRating and reviewCount
        return this.syncProductRating(productId).pipe(
          map(() => created)
        );
      }),
      catchError((error) => {
        console.error('Error adding review:', error);
        // Still try to sync even if POST failed (prototype resilience)
        return of({ id: 'temp', productId, authorId: user?.id || 'anonymous', authorName: user?.fullName || 'Anónimo', rating: review.rating, title: review.title, comment: review.comment, createdAt: new Date().toISOString(), updatedAt: undefined } as Review);
      })
    );
  }

  /**
   * Actualiza una reseña existente
   */
  updateReview(reviewId: string, review: Partial<Review>): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/reviews/${reviewId}`, review).pipe(
      switchMap((updated) => {
        // Sync product averageRating and reviewCount
        const productId = updated.productId || review.productId;
        if (productId) {
          return this.syncProductRating(productId).pipe(
            map(() => updated)
          );
        }
        return of(updated);
      }),
      catchError((error) => {
        console.error('Error updating review:', error);
        return of({ id: reviewId, ...review, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Review);
      })
    );
  }

  /**
   * Elimina una reseña
   */
  deleteReview(reviewId: string, productId?: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${reviewId}`).pipe(
      switchMap(() => {
        // Sync product averageRating and reviewCount
        if (productId) {
          return this.syncProductRating(productId).pipe(
            map(() => undefined as void)
          );
        }
        return of(undefined);
      }),
      catchError((error) => {
        console.error('Error deleting review:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Obtiene la calificación aggregate promedio para un producto
   */
  getAggregateRating(productId: string): Observable<number> {
    return this.getReviewsByProduct(productId).pipe(
      map(reviews => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return Number((sum / reviews.length).toFixed(2));
      }),
      catchError(() => of(0))
    );
  }

  /**
   * Verifica si el usuario tiene una compra verificada para el producto
   */
  checkVerifiedPurchase(userId: string, productId: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}/orders?userId=${userId}`).pipe(
      map(orders => {
        return orders.some(order =>
          order.items.some((item: any) => item.product.id === productId)
        );
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Obtiene todas las respuestas del vendedor
   */
  getSellerReplies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sellerReplies`).pipe(
      catchError((error) => {
        console.error('Error fetching seller replies:', error);
        return of([]);
      })
    );
  }

  /**
   * Sincroniza el averageRating y reviewCount de un producto
   * después de agregar, actualizar o eliminar una review
   */
  private syncProductRating(productId: string): Observable<any> {
    return this.getReviewsByProduct(productId).pipe(
      switchMap(reviews => {
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
          : 0;

        return this.http.patch(`${this.apiUrl}/products/${productId}`, {
          averageRating,
          reviewCount,
        });
      }),
      catchError((error) => {
        console.error('Error syncing product rating:', error);
        return of(null);
      })
    );
  }
}
