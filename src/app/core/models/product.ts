export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  inStock?: boolean;
  specs?: string[];
  badge?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface HomeCategory {
  id: string;
  name: string;
  tag: string;
  image: string;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  brand?: string;
  specs?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // 'Recommended' | 'Price: High to Low' | 'Price: Low to High' | 'Newest Arrivals'
  onlyNew?: boolean;
}

export interface GpuShowcaseItem {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly series: string;
  readonly vram: string;
  readonly price: number;
  readonly image: string;
  readonly link: string;
}

