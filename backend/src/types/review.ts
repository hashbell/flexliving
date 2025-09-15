export interface IReviewCategory {
  category: string;
  rating: number;
}

export interface IHostawayReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending' | 'rejected';
  rating: number | null;
  publicReview: string;
  reviewCategory: IReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel?: string;
}

export interface INormalizedReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending' | 'rejected';
  overallRating: number | null;
  publicReview: string;
  categories: IReviewCategory[];
  submittedAt: Date;
  guestName: string;
  propertyName: string;
  channel: string;
  isApproved: boolean;
}

export interface IReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [rating: number]: number };
  categoryAverages: { [category: string]: number };
  channelBreakdown: { [channel: string]: number };
  recentTrends: { date: string; count: number; avgRating: number }[];
}

export interface IPropertyPerformance {
  propertyId: string;
  propertyName: string;
  stats: IReviewStats;
  reviews: INormalizedReview[];
}

// Legacy type aliases for backward compatibility (can be removed later)
export type ReviewCategory = IReviewCategory;
export type HostawayReview = IHostawayReview;
export type NormalizedReview = INormalizedReview;
export type ReviewStats = IReviewStats;
export type PropertyPerformance = IPropertyPerformance;
