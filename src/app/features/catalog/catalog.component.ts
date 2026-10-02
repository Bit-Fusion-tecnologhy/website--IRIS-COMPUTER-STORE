import { CurrencyPipe, CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Category, Product } from '../../core/models/product';

export interface OpenSections {
  price: boolean;
  brand: boolean;
  specs: boolean;
  category: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit, OnDestroy {
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  /** Math reference for template */
  readonly Math = Math;

  private previousBodyOverflow = '';

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  // Active Filter States
  readonly query = signal('');
  readonly filter = signal('ALL');
  readonly sort = signal('Recomendados');
  readonly selectedBrand = signal<string>('ALL');
  readonly selectedSpecs = signal<string[]>([]);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly onlyNew = signal<boolean>(false);

  // Filter Drawer State & Staging (Temporary) Filter States (For all modes)
  readonly isFilterDrawerOpen = signal(false);
  readonly isMobileFilterDrawerOpen = this.isFilterDrawerOpen;
  readonly tempFilter = signal('ALL');
  readonly tempBrand = signal('ALL');
  readonly tempSpecs = signal<string[]>([]);
  readonly tempMinPrice = signal<number | null>(null);
  readonly tempMaxPrice = signal<number | null>(null);
  readonly tempOnlyNew = signal<boolean>(false);

  // Incremental / Infinite Loading States
  readonly displayedCount = signal(8);
  readonly isLoadingMore = signal(false);
  readonly visibleProducts = computed(() =>
    this.products().slice(0, this.displayedCount())
  );
  readonly hasMoreProducts = computed(() =>
    this.products().length > this.displayedCount()
  );

  // Active Filters Count (for badges)
  readonly activeFiltersCount = computed(() => {
    let count = 0;
    if (this.filter() !== 'ALL') count++;
    if (this.onlyNew()) count++;
    if (this.selectedBrand() !== 'ALL') count++;
    if (this.selectedSpecs().length > 0) count += this.selectedSpecs().length;
    if (this.minPrice() !== null || this.maxPrice() !== null) count++;
    return count;
  });

  readonly tempActiveFiltersCount = computed(() => {
    let count = 0;
    if (this.tempFilter() !== 'ALL') count++;
    if (this.tempOnlyNew()) count++;
    if (this.tempBrand() !== 'ALL') count++;
    if (this.tempSpecs().length > 0) count += this.tempSpecs().length;
    if (this.tempMinPrice() !== null || this.tempMaxPrice() !== null) count++;
    return count;
  });

  // Accordion toggle states
  readonly openSections = signal<OpenSections>({
    price: true,
    brand: true,
    specs: true,
    category: true,
  });

  readonly availableSpecs = ['RTX 40 Series', 'RX 7000 Series', '16GB+ VRAM', 'PCIe 5.0'];
  readonly availableBrands = ['ALL', 'ASUS', 'AMD', 'NVIDIA', 'Intel', 'Samsung', 'Keychron', 'SteelSeries', 'Corsair', 'Alienware', 'Iris'];

  readonly currentCategoryName = computed(() => {
    const cat = this.categories().find((c) => c.id === this.filter());
    return cat ? cat.name : 'Todo el Hardware';
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.filter.set(params['category'].toUpperCase());
      }
      if (params['brand']) {
        this.selectedBrand.set(params['brand']);
      }
      if (params['q']) {
        this.query.set(params['q']);
      }
      if (params['novedades'] === 'true' || params['filter'] === 'novedades') {
        this.onlyNew.set(true);
      }
      if (params['sort']) {
        this.sort.set(params['sort']);
      }
      this.loadCategories();
      this.fetchProducts();
    });
  }

  ngOnDestroy() {
    this.unlockBodyScroll();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {
        this.categories.set([
          { id: 'ALL', name: 'Todo el Hardware', slug: 'all' },
          { id: 'GPU', name: 'Tarjetas Gráficas', slug: 'gpu' },
          { id: 'CPU', name: 'Procesadores', slug: 'cpu' },
          { id: 'PERIPHERAL', name: 'Periféricos', slug: 'peripheral' },
          { id: 'MEMORY', name: 'Memoria & Almacenamiento', slug: 'memory' },
          { id: 'DISPLAYS', name: 'Monitores & Pantallas', slug: 'displays' },
          { id: 'SYSTEMS', name: 'Workstations & Sistemas', slug: 'systems' },
        ]);
      },
    });
  }

  fetchProducts() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService
      .getProducts({
        category: this.filter(),
        search: this.query(),
        brand: this.selectedBrand() === 'ALL' ? undefined : this.selectedBrand(),
        specs: this.selectedSpecs().length > 0 ? this.selectedSpecs() : undefined,
        minPrice: this.minPrice() !== null ? this.minPrice()! : undefined,
        maxPrice: this.maxPrice() !== null ? this.maxPrice()! : undefined,
        sort: this.sort(),
        onlyNew: this.onlyNew(),
      })
      .subscribe({
        next: (items) => {
          this.products.set(items);
          this.displayedCount.set(8);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.errorMessage.set('No se pudo conectar con el servidor de productos. Asegúrate de que json-server esté corriendo.');
          this.isLoading.set(false);
        },
      });
  }

  toggleSection(section: keyof OpenSections) {
    this.openSections.update((curr) => ({
      ...curr,
      [section]: !curr[section],
    }));
  }

  onCategoryChange(catId: string) {
    this.filter.set(catId);
    this.fetchProducts();
  }

  onBrandChange(brand: string) {
    this.selectedBrand.set(brand);
    this.fetchProducts();
  }

  onSearchChange(value: string) {
    this.query.set(value);
    this.fetchProducts();
  }

  onSortChange(value: string) {
    this.sort.set(value);
    this.fetchProducts();
  }

  toggleSpec(spec: string) {
    this.selectedSpecs.update((specs) =>
      specs.includes(spec) ? specs.filter((s) => s !== spec) : [...specs, spec]
    );
    this.fetchProducts();
  }

  toggleOnlyNew(value?: boolean) {
    this.onlyNew.update((curr) => (value !== undefined ? value : !curr));
    this.fetchProducts();
  }

  applyPriceFilter(min: number | null, max: number | null) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.fetchProducts();
  }

  clearFilters() {
    this.filter.set('ALL');
    this.query.set('');
    this.selectedBrand.set('ALL');
    this.selectedSpecs.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.onlyNew.set(false);
    this.sort.set('Recomendados');
    this.fetchProducts();
  }

  // Filter Drawer Methods (For all modes: Desktop, Tablet, Mobile)
  openFiltersDrawer() {
    this.tempFilter.set(this.filter());
    this.tempBrand.set(this.selectedBrand());
    this.tempSpecs.set([...this.selectedSpecs()]);
    this.tempMinPrice.set(this.minPrice());
    this.tempMaxPrice.set(this.maxPrice());
    this.tempOnlyNew.set(this.onlyNew());
    this.lockBodyScroll();
    this.isFilterDrawerOpen.set(true);
  }

  openMobileFilters() {
    this.openFiltersDrawer();
  }

  closeFiltersDrawer() {
    this.unlockBodyScroll();
    this.isFilterDrawerOpen.set(false);
  }

  closeMobileFilters() {
    this.closeFiltersDrawer();
  }

  toggleTempSpec(spec: string) {
    this.tempSpecs.update((specs) =>
      specs.includes(spec) ? specs.filter((s) => s !== spec) : [...specs, spec]
    );
  }

  setTempPrice(min: number | null, max: number | null) {
    this.tempMinPrice.set(min);
    this.tempMaxPrice.set(max);
  }

  clearDrawerFilters() {
    this.tempFilter.set('ALL');
    this.tempBrand.set('ALL');
    this.tempSpecs.set([]);
    this.tempMinPrice.set(null);
    this.tempMaxPrice.set(null);
    this.tempOnlyNew.set(false);
  }

  clearMobileFilters() {
    this.clearDrawerFilters();
  }

  applyDrawerFilters() {
    this.filter.set(this.tempFilter());
    this.selectedBrand.set(this.tempBrand());
    this.selectedSpecs.set([...this.tempSpecs()]);
    this.minPrice.set(this.tempMinPrice());
    this.maxPrice.set(this.tempMaxPrice());
    this.onlyNew.set(this.tempOnlyNew());
    this.unlockBodyScroll();
    this.isFilterDrawerOpen.set(false);
    this.fetchProducts();
  }

  applyMobileFilters() {
    this.applyDrawerFilters();
  }

  private lockBodyScroll() {
    if (isPlatformBrowser(this.platformId) && this.document?.body) {
      this.previousBodyOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
    }
  }

  private unlockBodyScroll() {
    if (isPlatformBrowser(this.platformId) && this.document?.body) {
      this.document.body.style.overflow = this.previousBodyOverflow || '';
    }
  }

  // Incremental Loading Method (Carga de 8 en 8)
  loadMore() {
    if (this.isLoadingMore() || !this.hasMoreProducts()) return;
    this.isLoadingMore.set(true);
    // Smooth delay so the skeleton loading effect is visible to the user
    setTimeout(() => {
      this.displayedCount.update((count) => count + 8);
      this.isLoadingMore.set(false);
    }, 600);
  }
}
