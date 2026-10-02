import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { signal } from '@angular/core';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  const mockAuthService = {
    currentUser: signal({ id: 'usr-iris-01', fullName: 'Test User' }),
    isAuthenticated: signal(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReviewsByProduct', () => {
    it('should fetch reviews for a product via HTTP', () => {
      const productId = 'rtx-4090';
      const mockReviews = [
        {
          id: 'rev-1',
          productId: 'rtx-4090',
          authorId: 'usr-iris-01',
          authorName: 'Test User',
          rating: 5,
          title: 'Great product',
          comment: 'Excellent quality',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'rev-2',
          productId: 'rtx-4090',
          authorId: 'usr-iris-02',
          authorName: 'Another User',
          rating: 4,
          title: 'Good product',
          comment: 'Good quality',
          createdAt: new Date().toISOString(),
        }
      ];

      service.getReviewsByProduct(productId).subscribe(reviews => {
        expect(reviews.length).toBe(2);
        expect(reviews[0].rating).toBe(5);
        expect(reviews[1].rating).toBe(4);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reviews?productId=${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReviews);
    });
  });

  describe('addReview', () => {
    it('should add a new review via HTTP POST', () => {
      const reviewData = {
        rating: 5,
        title: 'Excellent',
        comment: 'Excellent quality product'
      };
      const productId = 'rtx-4090';
      const newReview = {
        id: 'rev-new',
        productId: 'rtx-4090',
        authorId: 'usr-iris-01',
        authorName: 'Test User',
        rating: 5,
        title: 'Excellent',
        comment: 'Excellent quality product',
        createdAt: new Date().toISOString(),
        updatedAt: undefined
      };

      service.addReview(productId, reviewData).subscribe(review => {
        expect(review.id).toBe('rev-new');
        expect(review.rating).toBe(5);
        expect(review.comment).toBe('Excellent quality product');
      });

      // POST the review
      const postReq = httpMock.expectOne(`${environment.apiUrl}/reviews`);
      expect(postReq.request.method).toBe('POST');
      expect(postReq.request.body.rating).toBe(5);
      expect(postReq.request.body.comment).toBe('Excellent quality product');
      expect(postReq.request.body.productId).toBe('rtx-4090');
      expect(postReq.request.body.authorId).toBe('usr-iris-01');
      expect(postReq.request.body.authorName).toBe('Test User');
      postReq.flush(newReview);

      // syncProductRating calls getReviewsByProduct
      const getReq = httpMock.expectOne(`${environment.apiUrl}/reviews?productId=${productId}`);
      expect(getReq.request.method).toBe('GET');
      getReq.flush([newReview]);

      // syncProductRating PATCHes the product
      const patchReq = httpMock.expectOne(`${environment.apiUrl}/products/${productId}`);
      expect(patchReq.request.method).toBe('PATCH');
      patchReq.flush({ id: productId, averageRating: 5, reviewCount: 1 });
    });
  });

  describe('updateReview', () => {
    it('should update a review via HTTP PATCH', () => {
      const reviewId = 'rev-1';
      const updatedData = {
        rating: 5,
        title: 'Updated title',
        comment: 'Updated comment'
      };

      service.updateReview(reviewId, updatedData).subscribe(review => {
        expect(review.rating).toBe(5);
        expect(review.title).toBe('Updated title');
        expect(review.comment).toBe('Updated comment');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reviews/${reviewId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.rating).toBe(5);
      expect(req.request.body.title).toBe('Updated title');
      expect(req.request.body.comment).toBe('Updated comment');
      req.flush({ id: reviewId, ...updatedData, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: new Date().toISOString() });
    });
  });

  describe('deleteReview', () => {
    it('should delete a review via HTTP DELETE', () => {
      const reviewId = 'rev-1';

      service.deleteReview(reviewId).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reviews/${reviewId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('getAggregateRating', () => {
    it('should calculate aggregate rating from reviews', () => {
      const productId = 'rtx-4090';
      const mockReviews = [
        { rating: 5, productId: 'rtx-4090', authorId: 'usr-1', authorName: 'User1', comment: 'Great', createdAt: new Date().toISOString() },
        { rating: 4, productId: 'rtx-4090', authorId: 'usr-2', authorName: 'User2', comment: 'Good', createdAt: new Date().toISOString() },
        { rating: 3, productId: 'rtx-4090', authorId: 'usr-3', authorName: 'User3', comment: 'Okay', createdAt: new Date().toISOString() }
      ];

      service.getAggregateRating(productId).subscribe(aggregate => {
        expect(aggregate).toBeCloseTo(4); // (5+4+3)/3 = 4
        expect(aggregate).not.toBeNaN();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reviews?productId=${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReviews);
    });

    it('should return 0 when there are no reviews', () => {
      const productId = 'rtx-4090';

      service.getAggregateRating(productId).subscribe(aggregate => {
        expect(aggregate).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reviews?productId=${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('checkVerifiedPurchase', () => {
    it('should check if user has verified purchase for a product', () => {
      const userId = 'usr-iris-01';
      const productId = 'rtx-4090';

      service.checkVerifiedPurchase(userId, productId).subscribe(isVerified => {
        expect(typeof isVerified).toBe('boolean');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders?userId=${userId}`);
      expect(req.request.method).toBe('GET');
      const mockOrders = [
        {
          id: 'ord-1001',
          userId: 'usr-iris-01',
          items: [
            { product: { id: 'rtx-4090' }, quantity: 1 }
          ]
        }
      ];
      req.flush(mockOrders);
    });

    it('should return false when user has no orders', () => {
      const userId = 'usr-iris-01';
      const productId = 'rtx-4090';

      service.checkVerifiedPurchase(userId, productId).subscribe(isVerified => {
        expect(isVerified).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders?userId=${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});