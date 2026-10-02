import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

export interface SeoMetadata {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const SITE_NAME = 'Iris Computer';
const DEFAULT_OG_IMAGE = '/logo/iris.jpeg';
const DEFAULT_DESCRIPTION = 'Iris Computer — Hardware de ingeniería de precisión. Computadoras, laptops, componentes y periféricos de alto rendimiento para profesionales y gamers en Bolivia.';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Initialize route-level SEO tracking.
   * Call once from AppComponent ngOnInit.
   */
  initRouteSeo(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getDeepestChild(this.activatedRoute))
    ).subscribe(route => {
      const seo = route?.snapshot?.data?.['seo'] as SeoMetadata | undefined;
      if (seo) {
        this.update(seo);
      }
    });
  }

  /**
   * Set all SEO metadata for the current page.
   */
  update(config: SeoMetadata): void {
    const fullTitle = config.title.includes(SITE_NAME)
      ? config.title
      : `${config.title} | ${SITE_NAME}`;

    this.title.setTitle(fullTitle);

    const description = config.description || DEFAULT_DESCRIPTION;
    const canonical = config.canonical || '';
    const robots = config.robots || 'index, follow';
    const ogTitle = config.ogTitle || fullTitle;
    const ogDescription = config.ogDescription || description;
    const ogImage = config.ogImage || DEFAULT_OG_IMAGE;
    const ogType = config.ogType || 'website';
    const twitterCard = config.twitterCard || 'summary_large_image';

    // Base meta tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });

    if (config.ogUrl) {
      this.meta.updateTag({ property: 'og:url', content: config.ogUrl });
    }

    // Twitter / X
    this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    this.meta.updateTag({ name: 'twitter:title', content: config.twitterTitle || ogTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.twitterDescription || ogDescription });
    this.meta.updateTag({ name: 'twitter:image', content: config.twitterImage || ogImage });

    // Canonical
    if (canonical && this.isBrowser) {
      this.setCanonical(canonical);
    }
  }

  /**
   * Update only the title (for dynamic content like product names).
   */
  setTitle(title: string): void {
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    this.title.setTitle(fullTitle);
  }

  /**
   * Update only the description (for dynamic content).
   */
  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  /**
   * Set Open Graph image for social sharing.
   */
  setOgImage(imageUrl: string): void {
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  /**
   * Set canonical URL.
   */
  private setCanonical(url: string): void {
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  /**
   * Insert JSON-LD structured data into the document head.
   */
  setJsonLd(data: Record<string, unknown>): void {
    if (!this.isBrowser) return;

    // Remove existing JSON-LD
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Insert JSON-LD with a specific id (allows multiple schemas).
   */
  setJsonLdById(id: string, data: Record<string, unknown>): void {
    if (!this.isBrowser) return;

    const existing = document.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-id', id);
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Remove a specific JSON-LD schema by id.
   */
  removeJsonLdById(id: string): void {
    if (!this.isBrowser) return;
    const existing = document.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`);
    if (existing) existing.remove();
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
