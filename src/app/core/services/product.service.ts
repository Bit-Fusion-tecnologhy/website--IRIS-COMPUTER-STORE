import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category, HomeCategory, Product, ProductFilterParams } from '../models/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Obtiene la lista de productos aplicando filtros y ordenamiento
   */
  getProducts(filters?: ProductFilterParams): Observable<Product[]> {
    let params = new HttpParams();

    if (filters?.category && filters.category !== 'ALL') {
      params = params.set('category', filters.category);
    }

    if (filters?.brand) {
      params = params.set('brand', filters.brand);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(
      map(products => {
        let result = products;

        // Filtrado por búsqueda en nombre o subtítulo (cliente o json-server)
        if (filters?.search && filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          );
        }

        // Filtrado por novedades
        if (filters?.onlyNew) {
          result = result.filter(p => p.isNew || p.badge === 'Nuevo' || p.badge === 'Novedad' || p.badge === 'Novedoso');
        }

        // Filtrado por especificaciones técnicas
        if (filters?.specs && filters.specs.length > 0) {
          result = result.filter(p =>
            p.specs && filters.specs!.every(spec => p.specs!.includes(spec))
          );
        }

        // Filtrado por rango de precios
        if (filters?.minPrice !== undefined) {
          result = result.filter(p => p.price >= filters.minPrice!);
        }
        if (filters?.maxPrice !== undefined) {
          result = result.filter(p => p.price <= filters.maxPrice!);
        }

        // Ordenamiento
        if (filters?.sort) {
          switch (filters.sort) {
            case 'Precio: Menor a Mayor':
            case 'Price: Low to High':
              result = [...result].sort((a, b) => a.price - b.price);
              break;
            case 'Precio: Mayor a Menor':
            case 'Price: High to Low':
              result = [...result].sort((a, b) => b.price - a.price);
              break;
            case 'Mejor Evaluados':
            case 'Top Rated':
              result = [...result].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
              break;
            case 'Novedades':
            case 'Newest Arrivals':
              result = [...result].sort((a, b) => (b.isNew || b.badge === 'Nuevo' || b.badge === 'NEW' ? 1 : 0) - (a.isNew || a.badge === 'Nuevo' || a.badge === 'NEW' ? 1 : 0));
              break;
            default:
              // Recomendados
              break;
          }
        }

        return result;
      })
    );
  }

  /**
   * Obtiene un producto por su ID
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  /**
   * Obtiene las categorías del catálogo
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Obtiene las categorías visuales de la página de inicio
   */
  getHomeCategories(): Observable<HomeCategory[]> {
    return this.http.get<HomeCategory[]>(`${this.apiUrl}/homeCategories`);
  }

  /**
   * Obtiene los productos destacados o novedades
   */
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.filter(p => p.isFeatured || p.badge))
    );
  }

  /**
   * Obtiene todos los productos disponibles
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  /**
   * Obtiene productos con mejor valoración ordenados por calificación
   */
  getTopRatedProducts(limit: number = 4): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products =>
        products
          .filter(p => (p.averageRating || 0) >= 4.0)
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, limit)
      )
    );
  }

  /**
   * Obtiene los productos novedosos o recientes
   */
  getNoveltyProducts(limit: number = 12): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products =>
        products
          .filter(p => p.isNew || p.badge === 'Nuevo' || p.badge === 'Novedad' || p.badge === 'Novedoso')
          .slice(0, limit)
      )
    );
  }
}
