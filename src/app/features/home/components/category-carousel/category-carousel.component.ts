import { Component, input, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../../core/models/product';

@Component({
  selector: 'app-category-carousel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-carousel.component.html',
  styleUrl: './category-carousel.component.css',
})
export class CategoryCarouselComponent {
  readonly categories = input.required<Category[]>();
  readonly categoryImages = input<Record<string, string>>({});

  readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  scroll(direction: number) {
    const container = this.scrollContainer()?.nativeElement;
    if (container) {
      container.scrollBy({ left: direction * 240, behavior: 'smooth' });
    }
  }

  getImage(category: Category): string {
    return this.categoryImages()[category.id] || '';
  }

  getCategorySlug(category: Category): string {
    return `/catalog?category=${category.slug}`;
  }
}
