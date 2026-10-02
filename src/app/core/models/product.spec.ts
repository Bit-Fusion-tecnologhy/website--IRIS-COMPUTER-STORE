import { Product } from '../models/product';

describe('Product Interface Extension', () => {
  it('should include averageRating and reviewCount fields', () => {
    const product: Product = {
      id: 'rtx-4090',
      name: 'ASUS ROG Strix GeForce RTX 4090',
      category: 'GPU',
      brand: 'ASUS',
      subtitle: 'NVIDIA / 24GB GDDR6X',
      price: 1999,
      originalPrice: 2199,
      image: 'https://example.com/image.jpg',
      description: 'Test product',
      inStock: true,
      averageRating: 4.5,
      reviewCount: 120
    };
    expect(product.averageRating).toBe(4.5);
    expect(product.reviewCount).toBe(120);
    expect(typeof product.averageRating).toBe('number');
    expect(typeof product.reviewCount).toBe('number');
  });

  it('should work without the new fields (backward compatibility)', () => {
    const product: Product = {
      id: 'rtx-4090',
      name: 'ASUS ROG Strix GeForce RTX 4090',
      category: 'GPU',
      brand: 'ASUS',
      subtitle: 'NVIDIA / 24GB GDDR6X',
      price: 1999,
      originalPrice: 2199,
      image: 'https://example.com/image.jpg',
      description: 'Test product',
      inStock: true
      // averageRating and reviewCount are optional, should not error
    };
    expect(product.id).toBe('rtx-4090');
    expect(product.name).toBe('ASUS ROG Strix GeForce RTX 4090');
    // Fields are optional, so they can be undefined
    expect(product.averageRating).toBeUndefined();
    expect(product.reviewCount).toBeUndefined();
  });
});