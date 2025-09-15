import { INormalizedReview, IReviewStats, IPropertyPerformance } from '../types/review';

export class AnalyticsUtils {
  static calculateReviewStats(reviews: INormalizedReview[]): IReviewStats {
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {},
        categoryAverages: {},
        channelBreakdown: {},
        recentTrends: []
      };
    }

    // Calculate average rating
    const validRatings = reviews.filter(r => r.overallRating !== null);
    const averageRating = validRatings.length > 0 
      ? validRatings.reduce((sum, r) => sum + (r.overallRating || 0), 0) / validRatings.length
      : 0;

    // Calculate rating distribution
    const ratingDistribution: { [rating: number]: number } = {};
    validRatings.forEach(review => {
      const rating = review.overallRating || 0;
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    // Calculate category averages
    const categoryAverages: { [category: string]: number } = {};
    const categoryTotals: { [category: string]: { sum: number; count: number } } = {};

    reviews.forEach(review => {
      review.categories.forEach(category => {
        if (!categoryTotals[category.category]) {
          categoryTotals[category.category] = { sum: 0, count: 0 };
        }
        categoryTotals[category.category].sum += category.rating;
        categoryTotals[category.category].count += 1;
      });
    });

    Object.keys(categoryTotals).forEach(category => {
      const { sum, count } = categoryTotals[category];
      categoryAverages[category] = Math.round((sum / count) * 10) / 10;
    });

    // Calculate channel breakdown
    const channelBreakdown: { [channel: string]: number } = {};
    reviews.forEach(review => {
      channelBreakdown[review.channel] = (channelBreakdown[review.channel] || 0) + 1;
    });

    // Calculate recent trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentReviews = reviews.filter(r => r.submittedAt >= thirtyDaysAgo);
    const recentTrends = AnalyticsUtils.calculateTrends(recentReviews);

    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      categoryAverages,
      channelBreakdown,
      recentTrends
    };
  }

  private static calculateTrends(reviews: INormalizedReview[]): { date: string; count: number; avgRating: number }[] {
    const trends: { [date: string]: { count: number; totalRating: number } } = {};
    
    reviews.forEach(review => {
      const date = review.submittedAt.toISOString().split('T')[0];
      if (!trends[date]) {
        trends[date] = { count: 0, totalRating: 0 };
      }
      trends[date].count += 1;
      if (review.overallRating !== null) {
        trends[date].totalRating += review.overallRating;
      }
    });

    return Object.keys(trends)
      .sort()
      .map(date => ({
        date,
        count: trends[date].count,
        avgRating: trends[date].count > 0 
          ? Math.round((trends[date].totalRating / trends[date].count) * 10) / 10
          : 0
      }));
  }


  static getPropertyPerformance(reviews: INormalizedReview[]): IPropertyPerformance[] {
    // Group reviews by property
    const propertyMap = new Map<string, INormalizedReview[]>();
    
    reviews.forEach(review => {
      if (!propertyMap.has(review.propertyName)) {
        propertyMap.set(review.propertyName, []);
      }
      propertyMap.get(review.propertyName)!.push(review);
    });

    // Calculate performance for each property
    return Array.from(propertyMap.entries()).map(([propertyName, propertyReviews]) => {
      const stats = AnalyticsUtils.calculateReviewStats(propertyReviews);
      
      return {
        propertyId: propertyName.toLowerCase().replace(/\s+/g, '-'),
        propertyName,
        stats,
        reviews: propertyReviews
      };
    });
  }

  static filterReviews(
    reviews: INormalizedReview[],
    filters: {
      minRating?: number;
      maxRating?: number;
      channel?: string;
      propertyName?: string;
      dateFrom?: Date;
      dateTo?: Date;
      status?: string;
    }
  ): INormalizedReview[] {
    return reviews.filter(review => {
      // Rating filter
      if (filters.minRating !== undefined && (review.overallRating || 0) < filters.minRating) {
        return false;
      }
      if (filters.maxRating !== undefined && (review.overallRating || 0) > filters.maxRating) {
        return false;
      }

      // Channel filter
      if (filters.channel && review.channel !== filters.channel) {
        return false;
      }

      // Property filter
      if (filters.propertyName && review.propertyName !== filters.propertyName) {
        return false;
      }

      // Date filter
      if (filters.dateFrom && review.submittedAt < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && review.submittedAt > filters.dateTo) {
        return false;
      }

      // Status filter
      if (filters.status && review.status !== filters.status) {
        return false;
      }

      return true;
    });
  }
}
