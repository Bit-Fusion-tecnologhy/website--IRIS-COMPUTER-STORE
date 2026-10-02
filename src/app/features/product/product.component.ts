import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product';
import { ReviewsSectionComponent } from './components/reviews-section/reviews-section.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, ReviewsSectionComponent],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly seo = inject(SeoService);

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  // Gallery Image State
  readonly currentImageIndex = signal<number>(0);

  readonly currentImages = computed<string[]>(() => {
    const prod = this.product();
    if (!prod) return [];
    if (prod.images && prod.images.length > 0) {
      return prod.images;
    }
    return prod.image ? [prod.image] : [];
  });

  readonly activeImage = computed<string>(() => {
    const images = this.currentImages();
    if (images.length === 0) return '';
    const idx = this.currentImageIndex();
    return images[idx] || images[0];
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProduct(id);
      } else {
        this.isLoading.set(false);
        this.errorMessage.set('Producto no especificado.');
      }
    });
  }

  fetchProduct(id: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.currentImageIndex.set(0);

    this.productService.getProductById(id).subscribe({
      next: (item) => {
        this.product.set(item);
        this.currentImageIndex.set(0);
        this.isLoading.set(false);
        this.setProductSeo(item);
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.product.set(null);
        this.errorMessage.set('No se encontró el producto solicitado o el servidor no está disponible.');
        this.isLoading.set(false);
      }
    });
  }

  private setProductSeo(product: Product): void {
    const siteUrl = 'https://iriscoputer.com';
    const productUrl = `${siteUrl}/product/${product.id}`;
    const description = product.description?.substring(0, 160) || `${product.name} — ${product.subtitle}. Precio: $${product.price}. Iris Computer.`;

    this.seo.update({
      title: `${product.name} | Iris Computer`,
      description,
      canonical: productUrl,
      robots: 'index, follow',
      ogTitle: product.name,
      ogDescription: description,
      ogImage: product.image,
      ogUrl: productUrl,
      ogType: 'product',
      twitterCard: 'summary_large_image',
      twitterTitle: product.name,
      twitterDescription: description,
      twitterImage: product.image,
    });

    // JSON-LD Product schema
    this.seo.setJsonLdById('product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images?.length ? product.images : [product.image],
      brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
      sku: product.id,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.inStock !== false
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: productUrl,
      },
      aggregateRating: product.averageRating ? {
        '@type': 'AggregateRating',
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount || 1,
      } : undefined,
    });
  }

  prevImage() {
    const total = this.currentImages().length;
    if (total <= 1) return;
    this.currentImageIndex.update(idx => (idx - 1 + total) % total);
  }

  nextImage() {
    const total = this.currentImages().length;
    if (total <= 1) return;
    this.currentImageIndex.update(idx => (idx + 1) % total);
  }

  selectImage(index: number) {
    if (index >= 0 && index < this.currentImages().length) {
      this.currentImageIndex.set(index);
    }
  }
}
