import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
}

const STORAGE_KEY = 'iris_cart_items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly toastService = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  private previousBodyOverflow = '';
  readonly items = signal<CartItem[]>([]);
  readonly isOpen = signal(false);
  readonly isLoading = signal(false);

  readonly count = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
  readonly total = computed(() => this.items().reduce((total, item) => total + item.product.price * item.quantity, 0));

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }

  /**
   * Carga el estado del carrito desde LocalStorage y backend
   */
  loadCart() {
    // 1. Cargar desde LocalStorage para disponibilidad instantánea
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.items.set(parsed);
          }
        }
      } catch {
        // LocalStorage fallback
      }
    }

    // 2. Sincronizar con endpoint /cart si existe
    this.isLoading.set(true);
    this.http.get<CartItem[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    ).subscribe(items => {
      if (Array.isArray(items) && items.length > 0 && this.items().length === 0) {
        this.items.set(items);
        this.persistLocal(items);
      }
      this.isLoading.set(false);
    });
  }

  private persistLocal(items: CartItem[]) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // LocalStorage fallback
      }
    }
  }

  add(product: Product) {
    this.change(product, 1);
    this.toastService.success(`"${product.name}" agregado al carrito.`);
    this.open();
  }

  change(product: Product, delta: number) {
    this.items.update(items => {
      const found = items.find(item => item.product.id === product.id);
      let updated: CartItem[];
      if (!found) {
        updated = delta > 0 ? [...items, { product, quantity: delta }] : items;
      } else {
        const quantity = found.quantity + delta;
        updated = quantity <= 0
          ? items.filter(item => item !== found)
          : items.map(item => (item === found ? { ...item, quantity } : item));
      }
      this.persistLocal(updated);
      return updated;
    });
  }

  remove(product: Product) {
    this.items.update(items => {
      const updated = items.filter(item => item.product.id !== product.id);
      this.persistLocal(updated);
      return updated;
    });
    this.toastService.info(`"${product.name}" eliminado del carrito.`);
  }

  clear() {
    this.items.set([]);
    this.persistLocal([]);
    this.toastService.info('El carrito ha sido vaciado.');
  }

  open() {
    if (!this.isOpen()) {
      if (isPlatformBrowser(this.platformId) && this.document?.body) {
        this.previousBodyOverflow = this.document.body.style.overflow;
        this.document.body.style.overflow = 'hidden';
      }
    }
    this.isOpen.set(true);
  }

  close() {
    if (isPlatformBrowser(this.platformId) && this.document?.body) {
      this.document.body.style.overflow = this.previousBodyOverflow;
    }
    this.isOpen.set(false);
  }
}
