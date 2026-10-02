import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mb-8">
      <!-- Skeleton Headline -->
      <h3 class="font-headline text-headline-md font-semibold text-on-surface mb-6">Opiniones de Clientes</h3>

      <!-- Aggregate Rating Skeleton -->
      <div class="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-surface-card rounded-card border border-outline-variant">
        <div class="text-center md:text-left md:pr-8 md:border-r md:border-outline-variant">
          <div class="h-16 w-24 bg-surface-container-high rounded skeleton-pulse mx-auto md:mx-0 mb-3"></div>
          <div class="flex items-center justify-center md:justify-start gap-1 mb-2">
            <div class="h-5 w-5 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="h-5 w-5 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="h-5 w-5 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="h-5 w-5 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="h-5 w-5 bg-surface-container-high rounded skeleton-pulse"></div>
          </div>
          <div class="h-3 w-32 bg-surface-container-high rounded skeleton-pulse mx-auto md:mx-0"></div>
        </div>
        <div class="flex-1 space-y-3">
          <div class="flex items-center gap-3">
            <div class="h-4 w-8 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="flex-1 h-3 bg-surface-container-high rounded-pill skeleton-pulse"></div>
            <div class="h-4 w-10 bg-surface-container-high rounded skeleton-pulse"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-4 w-8 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="flex-1 h-3 bg-surface-container-high rounded-pill skeleton-pulse"></div>
            <div class="h-4 w-10 bg-surface-container-high rounded skeleton-pulse"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-4 w-8 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="flex-1 h-3 bg-surface-container-high rounded-pill skeleton-pulse"></div>
            <div class="h-4 w-10 bg-surface-container-high rounded skeleton-pulse"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-4 w-8 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="flex-1 h-3 bg-surface-container-high rounded-pill skeleton-pulse"></div>
            <div class="h-4 w-10 bg-surface-container-high rounded skeleton-pulse"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-4 w-8 bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="flex-1 h-3 bg-surface-container-high rounded-pill skeleton-pulse"></div>
            <div class="h-4 w-10 bg-surface-container-high rounded skeleton-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Sort Bar Skeleton -->
      <div class="flex items-center justify-between mb-6">
        <div class="h-4 w-32 bg-surface-container-high rounded skeleton-pulse"></div>
        <div class="h-10 w-40 bg-surface-container-high rounded-button skeleton-pulse"></div>
      </div>

      <!-- Review Card Skeletons -->
      @for (i of [1, 2]; track i) {
        <div class="p-5 bg-surface-card rounded-card border border-outline-variant mb-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-surface-container-high skeleton-pulse"></div>
            <div class="flex-1">
              <div class="h-4 w-32 bg-surface-container-high rounded skeleton-pulse mb-2"></div>
              <div class="h-3 w-20 bg-surface-container-high rounded skeleton-pulse"></div>
            </div>
            <div class="flex items-center gap-1">
              <div class="h-4 w-4 bg-surface-container-high rounded skeleton-pulse"></div>
              <div class="h-4 w-4 bg-surface-container-high rounded skeleton-pulse"></div>
              <div class="h-4 w-4 bg-surface-container-high rounded skeleton-pulse"></div>
              <div class="h-4 w-4 bg-surface-container-high rounded skeleton-pulse"></div>
              <div class="h-4 w-4 bg-surface-container-high rounded skeleton-pulse"></div>
            </div>
          </div>
          <div class="h-4 w-48 bg-surface-container-high rounded skeleton-pulse mb-2"></div>
          <div class="space-y-2">
            <div class="h-3 w-full bg-surface-container-high rounded skeleton-pulse"></div>
            <div class="h-3 w-3/4 bg-surface-container-high rounded skeleton-pulse"></div>
          </div>
        </div>
      }
    </section>
  `,
  styles: []
})
export class ReviewsSkeletonComponent {}
