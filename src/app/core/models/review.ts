export interface Review {
  id: string;
  productId: string;
  authorId: string;
  authorName: string;
  rating: number;          // 1-5
  title?: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  /** Review has a verified purchase */
  verifiedPurchase?: boolean;
  /** Seller reply for this review */
  sellerReply?: {
    id: string;
    reviewId: string;
    sellerId: string;
    sellerName: string;
    comment: string;
    createdAt: string;
  };
}