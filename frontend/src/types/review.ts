export interface IReviewCategory {
  category: string;
  rating: number;
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

export interface IDashboardData {
  overallStats: IReviewStats;
  propertyPerformance: IPropertyPerformance[];
  totalReviews: number;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  code?: string;
}

// Legacy type aliases for backward compatibility (can be removed later)
export type ReviewCategory = IReviewCategory;
export type NormalizedReview = INormalizedReview;
export type ReviewStats = IReviewStats;
export type PropertyPerformance = IPropertyPerformance;
export type DashboardData = IDashboardData;
export type ApiResponse<T> = IApiResponse<T>;
