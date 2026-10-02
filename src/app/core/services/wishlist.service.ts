import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product';
import { ToastService } from './toast.service';

const WISHLIST_STORAGE_KEY = 'iris_wishlist_items';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toastService = inject(ToastService);

  readonly items = signal<Product[]>([]);
  readonly count = computed(() => this.items().length);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadWishlist();
    }
  }

  private loadWishlist() {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.items.set(parsed);
        }
      }
    } catch {
      // Fallback
    }
  }

  private persistLocal(items: Product[]) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Fallback
      }
    }
  }

  isFavorite(productId: string): boolean {
    return this.items().some((p) => p.id === productId);
  }

  toggle(product: Product) {
    if (this.isFavorite(product.id)) {
      this.remove(product.id);
      this.toastService.info(`"${product.name}" eliminado de favoritos.`);
    } else {
      this.add(product);
      this.toastService.success(`"${product.name}" agregado a favoritos.`);
    }
  }

  add(product: Product) {
    if (!this.isFavorite(product.id)) {
      this.items.update((current) => {
        const updated = [...current, product];
        this.persistLocal(updated);
        return updated;
      });
    }
  }

  remove(productId: string) {
    this.items.update((current) => {
      const updated = current.filter((p) => p.id !== productId);
      this.persistLocal(updated);
      return updated;
    });
  }

  clear() {
    this.items.set([]);
    this.persistLocal([]);
    this.toastService.info('Lista de favoritos vaciada.');
  }
}
