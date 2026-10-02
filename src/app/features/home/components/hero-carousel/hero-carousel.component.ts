import {
  Component,
  input,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ElementRef,
  viewChild,
  HostListener,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.css',
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  readonly products = input.required<Product[]>();

  readonly slidesContainer = viewChild<ElementRef<HTMLDivElement>>('slidesContainer');

  readonly currentSlide = signal(0);
  readonly isPaused = signal(false);

  readonly totalSlides = computed(() => this.products().length);

  readonly currentProduct = computed(() => this.products()[this.currentSlide()]);

  readonly hasDiscount = computed(() => {
    const p = this.currentProduct();
    return p && p.originalPrice && p.originalPrice > p.price;
  });

  readonly discountPercent = computed(() => {
    const p = this.currentProduct();
    if (!p || !p.originalPrice) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly AUTOPLAY_INTERVAL = 5000;

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prev();
      this.resetAutoplay();
    } else if (event.key === 'ArrowRight') {
      this.next();
      this.resetAutoplay();
    }
  }

  next() {
    this.currentSlide.update((s) => (s + 1) % this.totalSlides());
    this.updateTransform();
  }

  prev() {
    this.currentSlide.update((s) => (s - 1 + this.totalSlides()) % this.totalSlides());
    this.updateTransform();
  }

  goTo(index: number) {
    this.currentSlide.set(index);
    this.updateTransform();
    this.resetAutoplay();
  }

  onMouseEnter() {
    this.isPaused.set(true);
    this.stopAutoplay();
  }

  onMouseLeave() {
    this.isPaused.set(false);
    this.startAutoplay();
  }

  private updateTransform() {
    const container = this.slidesContainer()?.nativeElement;
    if (container) {
      container.style.transform = `translateX(-${this.currentSlide() * 100}%)`;
    }
  }

  private startAutoplay() {
    if (this.autoplayTimer) return;
    this.autoplayTimer = setInterval(() => {
      if (!this.isPaused()) {
        this.next();
      }
    }, this.AUTOPLAY_INTERVAL);
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  getBadgeClass(product: Product): string {
    if (product.badge === 'Oferta' || this.hasDiscount()) return 'badge-sale';
    if (product.badge === 'Nuevo') return 'badge-new';
    return 'badge-hot';
  }

  getBadgeText(product: Product): string {
    if (this.hasDiscount()) return `-${this.discountPercent()}% OFF`;
    if (product.badge) return product.badge;
    return 'Nuevo';
  }
}
