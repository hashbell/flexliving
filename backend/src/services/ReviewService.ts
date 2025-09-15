import { INormalizedReview, IReviewStats, IPropertyPerformance } from '../types/review';
import { HostawayReviewRepository } from '../repositories/HostawayReviewRepository';
import { AnalyticsUtils } from '../utils/AnalyticsUtils';
import { LoggerService } from './LoggerService';

export class ReviewService {
  constructor(
    private reviewRepository: HostawayReviewRepository,
    private logger: LoggerService
  ) {}

  async getAllReviews(): Promise<INormalizedReview[]> {
    const reviews = await this.reviewRepository.getAllReviews();
    return reviews;
  }

  async getDashboardData(): Promise<{
    overallStats: IReviewStats;
    propertyPerformance: IPropertyPerformance[];
    totalReviews: number;
  }> {
    const reviews = await this.reviewRepository.getAllReviews();
    
    const overallStats = AnalyticsUtils.calculateReviewStats(reviews);
    const propertyPerformance = AnalyticsUtils.getPropertyPerformance(reviews);
    
    return {
      overallStats,
      propertyPerformance,
      totalReviews: reviews.length
    };
  }

  async getPropertyReviews(propertyName: string): Promise<{
    propertyName: string;
    reviews: INormalizedReview[];
    stats: IReviewStats;
  }> {
    const reviews = await this.reviewRepository.getReviewsByProperty(propertyName);
    const stats = AnalyticsUtils.calculateReviewStats(reviews);
    
    return {
      propertyName,
      reviews,
      stats
    };
  }

  async getApprovedReviews(): Promise<INormalizedReview[]> {
    const reviews = await this.reviewRepository.getApprovedReviews();
    return reviews;
  }

  async updateReviewApproval(reviewId: number, isApproved: boolean): Promise<boolean> {
    const success = await this.reviewRepository.updateReviewApproval(reviewId, isApproved);
    return success;
  }

  async getFilteredReviews(filters: {
    minRating?: number;
    maxRating?: number;
    channel?: string;
    propertyName?: string;
    dateFrom?: Date;
    dateTo?: Date;
    status?: string;
  }): Promise<{
    reviews: INormalizedReview[];
    stats: IReviewStats;
    count: number;
    filters: any;
  }> {
    const allReviews = await this.reviewRepository.getAllReviews();
    const filteredReviews = AnalyticsUtils.filterReviews(allReviews, filters);
    const stats = AnalyticsUtils.calculateReviewStats(filteredReviews);
    
    return {
      reviews: filteredReviews,
      stats,
      count: filteredReviews.length,
      filters
    };
  }
}
