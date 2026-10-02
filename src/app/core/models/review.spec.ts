import { Review } from '../models/review';

describe('Review Interface', () => {
  it('should have the expected structure with all required fields', () => {
    const review: Review = {
      id: 'review-1',
      productId: 'product-1',
      authorId: 'usr-iris-01',
      authorName: 'Test User',
      rating: 5,
      title: 'Excellent product',
      comment: 'Great quality and fast delivery',
      createdAt: new Date().toISOString(),
    };
    expect(review.rating).toBe(5);
    expect(review.id).toBe('review-1');
    expect(review.productId).toBe('product-1');
    expect(review.authorName).toBe('Test User');
    expect(review.comment).toBe('Great quality and fast delivery');
  });
});