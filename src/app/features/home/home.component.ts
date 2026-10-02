import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpuShowcaseItem, Category, Product } from '../../core/models/product';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { BenefitsBarComponent } from './components/beneficts-bar/benefits-bar.component';
import { BrandsShowcaseComponent } from './components/brands-show-case/brands-showcase.component';
import { CategoryCarouselComponent } from './components/category-carousel/category-carousel.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    FormsModule,
    HeroCarouselComponent,
    BenefitsBarComponent,
    BrandsShowcaseComponent,
    CategoryCarouselComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    '(window:pointerup)': 'onWindowPointerUp($event)',
    '(window:pointercancel)': 'onWindowPointerUp($event)',
  }
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly cart = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly categories = signal<Category[]>([]);
  readonly heroProducts = signal<Product[]>([]);
  readonly arrivals = signal<Product[]>([]);
  readonly isLoading = signal(true);

  /** Map of category IDs to placeholder background images */
  readonly categoryImages: Record<string, string> = {
    GPU: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    CPU: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    PERIPHERAL: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    MEMORY: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
    DISPLAYS: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    SYSTEMS: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop&q=80',
  };

  // --- SECCIÓN 5: ÚLTIMAS NOVEDADES ---
  readonly novelties = signal<Product[]>([]);
  readonly noveltyTrack = computed(() => {
    const list = this.novelties();
    return list.length > 0 ? [...list, ...list, ...list] : [];
  });
  readonly isDragging = signal<boolean>(false);
  readonly isInteracting = signal<boolean>(false);

  @ViewChild('noveltyScrollContainer') noveltyScrollContainerRef?: ElementRef<HTMLDivElement>;

  private animationFrameId: number | null = null;
  private resumeTimeout: ReturnType<typeof setTimeout> | null = null;
  private startX = 0;
  private scrollStart = 0;
  private hasMoved = false;
  private scrollAccumulator = 0;
  private readonly scrollSpeed = 0.85;

  // --- SECCIÓN 6: PRODUCTOS CON MEJOR VALORACIÓN ---
  readonly topRated = signal<Product[]>([]);

  // --- SECCIÓN 7: FRANJA OFICIAL NVIDIA GEFORCE (SHOWCASE CINEMÁTICO) ---
  readonly gpuShowcase: readonly GpuShowcaseItem[] = [
    {
      id: 'rtx-4090',
      name: 'ASUS ROG Strix GeForce RTX 4090 OC',
      shortName: 'RTX 4090',
      series: 'Ada Lovelace • DLSS 3.5',
      vram: '24GB GDDR6X',
      price: 1999,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSm4Q19hWx7TiFHgmv5FxONEQyvj4Fc6RfY9BDHmBMd0euRUwlmvDHMb7Z3ai-IpWoQaoZO_78bsQzk-rNSGAXVJP0EjOlkEn50qBTuRiEYANf3_EuxBU7kFqvNMgzweMBPXmMrueHg7qKY3GsgjJm7MeDReW3lGcMlEeD9Gp3jmFu1LqM53VAHj2WA89jgq3RGx7QQQV9wXu9gCjB9LX59gqUPEXlj-15WJyRmr92j1S426btaZrw',
      link: '/product/rtx-4090'
    },
    {
      id: 'rtx-4080',
      name: 'NVIDIA GeForce RTX 4080 SUPER Founders',
      shortName: 'RTX 4080 SUPER',
      series: 'Founders Edition • Dual Flow',
      vram: '16GB GDDR6X',
      price: 799,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiHe9JlItZCLuZlfKibVXrQdzfbKMfEgtOn0_Sjsfb_b78bo_xzZ0PLvzLkBJp44DChsXATa9DmsRptAxjF1dSeCabk9GNouWBZQ3Ju05CC7azuFtJsk0je2OCez-b1Eif_V52BnwMigXHvqI3nGDT8tVATZFc3hWUpdxt8hP15eP3E4yp9Zmi15wPFTa-9M_kUmjpVKJv-gvQ5o-H0tbuwmEXjKR51HoCaDe2HGDtNh2gZO77UPJ2',
      link: '/product/rtx-4080'
    },
    {
      id: 'rtx-4070-ti',
      name: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER',
      shortName: 'RTX 4070 Ti',
      series: 'Military Grade • Ray Tracing',
      vram: '16GB GDDR6X',
      price: 949,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79c3PrczCICi-9iFIgK0bmDvG4OhYq0XMwxTUzgLvnaY70gz4IAFKWFnQP8ECU0v21ZFP8BHDzTRMgXXyTD-bgoNZo1Q_sEm_Id1DCamSWn8Ld3eNxlXc_7BBo0wuaPM0HBxegiygGAwTEaMVE9hofBdysNIA4tc8su3Jqc1aZJBsFNCrNBmMW01WrdTgRDuSrnrl0VbHQaiKaSohI6XLGC7amt-d6heLcFuSQ56QB9ktEp4znb8y',
      link: '/catalog'
    }
  ];

  readonly currentGpuIndex = signal<number>(0);
  readonly isManualExiting = signal<boolean>(false);
  readonly isGpuPaused = signal<boolean>(false);

  private gpuTimerId: ReturnType<typeof setTimeout> | null = null;
  private gpuManualExitId: ReturnType<typeof setTimeout> | null = null;
  private readonly gpuSlideDuration = 3300;
  private slideStartTime = 0;
  private slideRemainingTime = 3300;

  // --- SECCIÓN 8: COMBO BUILDER INTERACTIVO ---
  readonly allProducts = signal<Product[]>([]);
  readonly selectedComboProducts = signal<Product[]>([]);
  readonly isPickerOpen = signal<boolean>(false);
  readonly pickerCategory = signal<string>('ALL');
  readonly pickerSearch = signal<string>('');

  /** Subtotal de productos en el combo */
  readonly comboSubtotal = computed(() =>
    this.selectedComboProducts().reduce((sum, p) => sum + p.price, 0)
  );

  /** Tasa de descuento: 0% para 1 item, 8% para 2 items, 15% para 3 o más items */
  readonly comboDiscountRate = computed(() => {
    const count = this.selectedComboProducts().length;
    if (count >= 3) return 0.15;
    if (count === 2) return 0.08;
    return 0;
  });

  /** Monto de ahorro calculado */
  readonly comboDiscountAmount = computed(() =>
    Math.round(this.comboSubtotal() * this.comboDiscountRate())
  );

  /** Precio final con descuento de combo aplicado */
  readonly comboTotalPrice = computed(() =>
    this.comboSubtotal() - this.comboDiscountAmount()
  );

  /** Productos filtrados para el selector del combo */
  readonly filteredPickerProducts = computed(() => {
    const category = this.pickerCategory();
    const query = this.pickerSearch().trim().toLowerCase();
    return this.allProducts().filter((p) => {
      const matchCat = category === 'ALL' || p.category.toUpperCase() === category.toUpperCase();
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  });

  ngOnInit() {
    this.loadHomeData();
    this.loadExtendedSections();
    this.setOrganizationSchema();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.startAutoScroll();
      this.startGpuShowcaseTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    this.stopGpuShowcaseTimer();
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }
  }

  private setOrganizationSchema(): void {
    this.seo.setJsonLdById('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Iris Computer',
      url: 'https://iriscoputer.com',
      logo: 'https://iriscoputer.com/logo/iris.jpeg',
      description:
        'Hardware de ingeniería de precisión. Computadoras, laptops, componentes y periféricos de alto rendimiento.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BO',
        addressRegion: 'Santa Cruz',
      },
      sameAs: ['https://facebook.com', 'https://instagram.com', 'https://x.com'],
    });

    this.seo.setJsonLdById('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Iris Computer',
      url: 'https://iriscoputer.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://iriscoputer.com/catalog?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  }

  loadHomeData() {
    // Load real categories for the carousel
    this.productService.getCategories().subscribe({
      next: (cats) => {
        // Filter out "ALL" — it's not a browsable category
        this.categories.set(cats.filter((c) => c.id !== 'ALL'));
      },
      error: () => {
        // Fallback categories if API fails
        this.categories.set([
          { id: 'GPU', name: 'Tarjetas Gráficas', slug: 'gpu' },
          { id: 'CPU', name: 'Procesadores', slug: 'cpu' },
          { id: 'PERIPHERAL', name: 'Periféricos', slug: 'peripheral' },
          { id: 'MEMORY', name: 'Memoria & Almacenamiento', slug: 'memory' },
          { id: 'DISPLAYS', name: 'Monitores & Pantallas', slug: 'displays' },
          { id: 'SYSTEMS', name: 'Workstations & Sistemas', slug: 'systems' },
        ]);
      },
    });

    // Load featured products for hero carousel
    this.productService.getFeaturedProducts().subscribe({
      next: (prods) => {
        // Take first 3 featured products for the hero carousel
        this.heroProducts.set(prods.slice(0, 3));
      },
    });

    // Load featured products for the product grid (max 4)
    this.productService.getFeaturedProducts().subscribe({
      next: (prods) => {
        this.arrivals.set(prods.slice(0, 4));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Carga de datos para las secciones extendidas (Novedades, Mejor Valorados y Combos)
   */
  loadExtendedSections() {
    this.productService.getNoveltyProducts(12).subscribe({
      next: (prods) => {
        if (prods && prods.length > 0) {
          this.novelties.set(prods);
        } else {
          this.setFallbackNovelties();
        }
      },
      error: () => this.setFallbackNovelties()
    });

    this.productService.getTopRatedProducts(4).subscribe({
      next: (prods) => this.topRated.set(prods),
      error: () => {}
    });

    this.productService.getAllProducts().subscribe({
      next: (prods) => {
        this.allProducts.set(prods);
        // Inicializar combo inicial sugerido si está vacío
        if (this.selectedComboProducts().length === 0 && prods.length >= 3) {
          const suggested = [
            prods.find(p => p.id === 'rtx-4080'),
            prods.find(p => p.id === 'ryzen-7-7800x3d'),
            prods.find(p => p.id === 'samsung-990-pro')
          ].filter((p): p is Product => !!p);
          if (suggested.length >= 2) {
            this.selectedComboProducts.set(suggested);
          }
        }
      },
      error: () => {}
    });
  }

  // --- MÉTODOS DEL COMBO BUILDER ---

  isProductInCombo(productId: string): boolean {
    return this.selectedComboProducts().some((p) => p.id === productId);
  }

  addToCombo(product: Product): void {
    if (this.isProductInCombo(product.id)) {
      this.toast.info(`"${product.name}" ya forma parte de tu combo.`);
      return;
    }
    this.selectedComboProducts.update((items) => [...items, product]);
    this.toast.success(`"${product.name}" agregado al combo.`);
  }

  removeFromCombo(productId: string): void {
    const item = this.selectedComboProducts().find((p) => p.id === productId);
    this.selectedComboProducts.update((items) => items.filter((p) => p.id !== productId));
    if (item) {
      this.toast.info(`"${item.name}" retirado del combo.`);
    }
  }

  clearCombo(): void {
    this.selectedComboProducts.set([]);
    this.toast.info('Se han retirado todos los productos del combo.');
  }

  applyComboPreset(presetType: 'gamer' | 'peripherals' | 'creator'): void {
    const prods = this.allProducts();
    if (prods.length === 0) return;

    let targetIds: string[] = [];
    if (presetType === 'gamer') {
      targetIds = ['rtx-4080', 'ryzen-7-7800x3d', 'samsung-990-pro'];
    } else if (presetType === 'peripherals') {
      targetIds = ['keychron-q1', 'apex-pro', 'rog-swift-oled'];
    } else if (presetType === 'creator') {
      targetIds = ['i9-14900ks', 'rtx-4090', 'dominator-titanium'];
    }

    const matched = prods.filter((p) => targetIds.includes(p.id));
    if (matched.length > 0) {
      this.selectedComboProducts.set(matched);
      this.toast.success(`Preset "${presetType.toUpperCase()}" cargado en tu combo.`);
    }
  }

  openPicker(category: string = 'ALL'): void {
    this.pickerCategory.set(category);
    this.pickerSearch.set('');
    this.isPickerOpen.set(true);
  }

  closePicker(): void {
    this.isPickerOpen.set(false);
  }

  addComboToCart(): void {
    const items = this.selectedComboProducts();
    if (items.length === 0) {
      this.toast.warning('Selecciona al menos 1 producto para armar tu combo.');
      return;
    }

    for (const prod of items) {
      this.cart.change(prod, 1);
    }

    const discount = this.comboDiscountAmount();
    const discountMsg =
      discount > 0 ? ` con $${discount} USD de ahorro en combo!` : '!';
    this.toast.success(`¡Combo (${items.length} piezas) añadido al carrito${discountMsg}`);
    this.cart.open();
  }

  getBadgeClass(badge: string): string {
    const b = badge.toLowerCase();
    if (b.includes('oferta') || b.includes('top ventas')) return 'bg-red-600';
    if (b.includes('nuevo') || b.includes('gen')) return 'bg-cyan-600';
    if (b.includes('stock')) return 'bg-emerald-600';
    if (b.includes('popular') || b.includes('destacado')) return 'bg-primary-container';
    return 'bg-primary-container';
  }

  private setFallbackNovelties(): void {
    this.novelties.set([
      {
        id: 'rtx-4070-ti',
        name: 'ASUS ROG Strix GeForce RTX 4070 Ti SUPER',
        category: 'GPU',
        brand: 'ASUS',
        subtitle: 'NVIDIA / 16GB GDDR6X',
        price: 949,
        originalPrice: 1049,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiHe9JlItZCLuZlfKibVXrQdzfbKMfEgtOn0_Sjsfb_b78bo_xzZ0PLvzLkBJp44DChsXATa9DmsRptAxjF1dSeCabk9GNouWBZQ3Ju05CC7azuFtJsk0je2OCez-b1Eif_V52BnwMigXHvqI3nGDT8tVATZFc3hWUpdxt8hP15eP3E4yp9Zmi15wPFTa-9M_kUmjpVKJv-gvQ5o-H0tbuwmEXjKR51HoCaDe2HGDtNh2gZO77UPJ2',
        description: 'Potencia gráfica de última generación con DLSS 3 y refrigeración avanzada.',
        badge: 'Nuevo',
        isNew: true
      },
      {
        id: 'i7-14700k',
        name: 'Intel Core i7-14700K Raptor Lake Refresh',
        category: 'CPU',
        brand: 'Intel',
        subtitle: 'INTEL / 20 NÚCLEOS',
        price: 439,
        originalPrice: 489,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4VoYJMT_orhtdYnWjW2qdopzPgE1Qtr4E7AmGgWpcynbTQZ3PrRVVogi1v1IBDN1G51VlYvoovNyEIsQXZ8FDVn3Dz01QQ8PhfnfeVHzloqf5H3pedfDgyfYhlecEG4pgNKYowCHxLONbRclzxMI4JAN6j4bWZzVXHysN3ysLmbmyI-zNfR-HZa4SX5EzJpeVgKF-FhDaVNlqAtMB4EouaVPFsIW395OQ2OQIZcrF30Gw-OHE-U5_',
        description: 'Arquitectura híbrida optimizada de 14ª generación.',
        badge: 'Nuevo',
        isNew: true
      },
      {
        id: 'g-pro-x-superlight-2',
        name: 'Logitech G PRO X SUPERLIGHT 2',
        category: 'PERIPHERAL',
        brand: 'Logitech',
        subtitle: 'LOGITECH / HERO 2 / 60G',
        price: 159,
        originalPrice: 179,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7jlwBKx_-IenNPHEgjQtyAMna_S_1dF-vifWl1M5jrpqaUS44gpPQBnRbja9Tyhhw8wUED9yNk1qqUke7xRDoy-fmat1RJ7QP4nL84u26-CeZ71wa6VsZPgjKQrbuW9AO5-Jh4aLJUJW1fFOfEQmBArl7V68GMUSNJqd8W09rtV2McgAgc5ABh39VUcfS6YqVHvcxIwTJ-w-449_WUlODRXSUk-ilyki3gjVOHcNhxydWLycpYs_9',
        description: 'Ratón inalámbrico ultraligero competitivo para esports.',
        badge: 'Nuevo',
        isNew: true
      },
      {
        id: 'lg-ultragear-oled',
        name: 'LG UltraGear 27GR95QE-B OLED 240Hz',
        category: 'PERIPHERAL',
        brand: 'LG',
        subtitle: 'LG / OLED QHD / 0.03MS',
        price: 899,
        originalPrice: 999,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzEwC1CLF8Q2Ahepcis_PKKdt-Yc2d6eYR23-Yw435RcjeII5zcXgD728rknsp6krlPQzkYE_p-63IQp0DKZSs8DpgoC8OxwVcjEKHa7YNk4ANMSQTFLJVWeRsmDmA2drgRapQdp3k03pzrrYC0VoO8Y-wr7_R8dtmGcVYxl6dEd2sGDuNxrKOutYWt50C2uvHaTvjTt9kUVhHhAOq0mRjFDGbFR7j1It6zs5kqk0_DCFJTxnysTXS',
        description: 'Monitor gaming OLED de 240Hz con contraste infinito.',
        badge: 'Nuevo',
        isNew: true
      }
    ]);
  }

  // --- CAROUSEL INTERACTIVO DE NOVEDADES (Auto-scroll & Drag) ---

  private startAutoScroll(): void {
    if (!this.isBrowser || this.animationFrameId !== null) return;
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        const el = this.noveltyScrollContainerRef?.nativeElement;
        if (el && !this.isInteracting() && !this.isDragging()) {
          this.scrollAccumulator += this.scrollSpeed;
          const segment = el.scrollWidth / 3;
          if (segment > 0 && this.scrollAccumulator >= segment * 2) {
            this.scrollAccumulator -= segment;
          }
          el.scrollLeft = this.scrollAccumulator;
        }
        this.animationFrameId = requestAnimationFrame(loop);
      };
      this.animationFrameId = requestAnimationFrame(loop);
    });
  }

  private stopAutoScroll(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  onPointerDown(event: PointerEvent): void {
    const el = this.noveltyScrollContainerRef?.nativeElement;
    if (!el) return;
    this.isDragging.set(true);
    this.isInteracting.set(true);
    this.hasMoved = false;
    this.startX = event.clientX;
    this.scrollStart = el.scrollLeft;
    this.scrollAccumulator = el.scrollLeft;
    if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
    try {
      el.setPointerCapture(event.pointerId);
    } catch {}
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) return;
    const el = this.noveltyScrollContainerRef?.nativeElement;
    if (!el) return;
    const dx = event.clientX - this.startX;
    if (Math.abs(dx) > 5) {
      this.hasMoved = true;
    }
    let newScroll = this.scrollStart - dx;
    const segment = el.scrollWidth / 3;
    if (segment > 0) {
      if (newScroll >= segment * 2) {
        newScroll -= segment;
        this.scrollStart -= segment;
      } else if (newScroll <= 0) {
        newScroll += segment;
        this.scrollStart += segment;
      }
    }
    el.scrollLeft = newScroll;
    this.scrollAccumulator = newScroll;
  }

  onPointerUp(event?: PointerEvent): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    const el = this.noveltyScrollContainerRef?.nativeElement;
    if (el) {
      this.scrollAccumulator = el.scrollLeft;
      if (event) {
        try {
          el.releasePointerCapture(event.pointerId);
        } catch {}
      }
    }
    this.scheduleAutoScrollResume(1200);
  }

  onPointerCancel(event?: PointerEvent): void {
    this.onPointerUp(event);
  }

  onWindowPointerUp(event: PointerEvent): void {
    if (this.isDragging()) {
      this.onPointerUp(event);
    }
  }

  onMouseEnter(): void {
    this.isInteracting.set(true);
    if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
    const el = this.noveltyScrollContainerRef?.nativeElement;
    if (el) this.scrollAccumulator = el.scrollLeft;
  }

  onMouseLeave(): void {
    if (!this.isDragging()) {
      this.scheduleAutoScrollResume(1000);
    }
  }

  onWheel(event: WheelEvent): void {
    const el = this.noveltyScrollContainerRef?.nativeElement;
    if (!el) return;
    this.isInteracting.set(true);
    this.scrollAccumulator = el.scrollLeft;
    this.scheduleAutoScrollResume(1200);
  }

  scrollNovelties(direction: 'left' | 'right'): void {
    const el = this.noveltyScrollContainerRef?.nativeElement;
    if (!el) return;
    this.isInteracting.set(true);
    const amount = 340;
    el.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
    setTimeout(() => {
      if (el) this.scrollAccumulator = el.scrollLeft;
    }, 350);
    this.scheduleAutoScrollResume(1800);
  }

  handleCardClick(event: MouseEvent): void {
    if (this.hasMoved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private scheduleAutoScrollResume(delayMs: number = 1500): void {
    if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      this.isInteracting.set(false);
    }, delayMs);
  }

  // --- MÉTODOS DEL SHOWCASE DE GPUS NVIDIA ---

  startGpuShowcaseTimer(): void {
    if (!this.isBrowser) return;
    this.stopGpuShowcaseTimer();
    this.slideRemainingTime = this.gpuSlideDuration;
    this.slideStartTime = Date.now();
    this.scheduleNextGpuSlide(this.gpuSlideDuration);
  }

  stopGpuShowcaseTimer(): void {
    if (this.gpuTimerId) {
      clearTimeout(this.gpuTimerId);
      this.gpuTimerId = null;
    }
    if (this.gpuManualExitId) {
      clearTimeout(this.gpuManualExitId);
      this.gpuManualExitId = null;
    }
  }

  private scheduleNextGpuSlide(delayMs: number): void {
    if (!this.isBrowser) return;
    if (this.gpuTimerId) clearTimeout(this.gpuTimerId);
    this.ngZone.runOutsideAngular(() => {
      this.gpuTimerId = setTimeout(() => {
        this.ngZone.run(() => {
          if (!this.isGpuPaused()) {
            this.advanceGpuSlide();
          }
        });
      }, delayMs);
    });
  }

  private advanceGpuSlide(): void {
    if (this.isManualExiting()) return;
    const current = this.currentGpuIndex();
    const next = (current + 1) % this.gpuShowcase.length;
    this.currentGpuIndex.set(next);

    this.slideRemainingTime = this.gpuSlideDuration;
    this.slideStartTime = Date.now();
    this.scheduleNextGpuSlide(this.gpuSlideDuration);
  }

  selectGpu(index: number): void {
    if (index === this.currentGpuIndex() || this.isManualExiting()) return;
    this.stopGpuShowcaseTimer();
    this.isManualExiting.set(true);

    if (this.gpuManualExitId) clearTimeout(this.gpuManualExitId);
    this.gpuManualExitId = setTimeout(() => {
      this.isManualExiting.set(false);
      this.currentGpuIndex.set(index);
      this.slideRemainingTime = this.gpuSlideDuration;
      this.slideStartTime = Date.now();
      this.scheduleNextGpuSlide(this.gpuSlideDuration);
    }, 350);
  }

  onGpuMouseEnter(): void {
    this.isGpuPaused.set(true);
    if (this.gpuTimerId) {
      clearTimeout(this.gpuTimerId);
      this.gpuTimerId = null;
    }
    const elapsed = Date.now() - this.slideStartTime;
    this.slideRemainingTime = Math.max(600, this.slideRemainingTime - elapsed);
  }

  onGpuMouseLeave(): void {
    this.isGpuPaused.set(false);
    this.slideStartTime = Date.now();
    this.scheduleNextGpuSlide(this.slideRemainingTime);
  }
}
