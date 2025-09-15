import { Request } from 'express';
import { ReviewService } from '../services/ReviewService';
import { LoggerService } from '../services/LoggerService';
import { StatusCodes } from 'http-status-codes';

export class ReviewController {
  constructor(
    private reviewService: ReviewService,
    private logger: LoggerService
  ) {}

  async getAllReviews(req: Request) {
    return await this.reviewService.getAllReviews();
  }

  async getDashboardData(req: Request) {
    return await this.reviewService.getDashboardData();
  }

  async getPropertyReviews(req: Request) {
    const { propertyName } = req.params;
    return await this.reviewService.getPropertyReviews(propertyName);
  }

  async getApprovedReviews(req: Request) {
    return await this.reviewService.getApprovedReviews();
  }

  async updateReviewApproval(req: Request) {
    const { reviewId } = req.params;
    const { isApproved } = req.body;
    
    const success = await this.reviewService.updateReviewApproval(
      parseInt(reviewId),
      isApproved
    );
    
    return { success, reviewId: parseInt(reviewId), isApproved };
  }

  async getFilteredReviews(req: Request) {
    const filters = req.query;
    return await this.reviewService.getFilteredReviews(filters);
  }
}
