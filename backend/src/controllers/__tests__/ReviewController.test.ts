import { Request } from 'express';
import { ReviewController } from '../ReviewController';
import { ReviewService } from '../../services/ReviewService';
import { LoggerService } from '../../services/LoggerService';

// Mock dependencies
jest.mock('../../services/ReviewService');
jest.mock('../../services/LoggerService');

describe('ReviewController', () => {
  let reviewController: ReviewController;
  let mockReviewService: jest.Mocked<ReviewService>;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockReviewService = new ReviewService({} as any, {} as any) as jest.Mocked<ReviewService>;
    mockLogger = new LoggerService() as jest.Mocked<LoggerService>;
    reviewController = new ReviewController(mockReviewService, mockLogger);

    mockRequest = {};
  });

  describe('getAllReviews', () => {
    it('should return all reviews', async () => {
      const mockReviews = [
        { id: 1, guestName: 'John Doe', overallRating: 4.5 },
        { id: 2, guestName: 'Jane Smith', overallRating: 3.8 }
      ];

      mockReviewService.getAllReviews.mockResolvedValue(mockReviews as any);

      const result = await reviewController.getAllReviews(mockRequest as Request);

      expect(mockReviewService.getAllReviews).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReviews);
    });
  });

  describe('getApprovedReviews', () => {
    it('should return approved reviews', async () => {
      const mockApprovedReviews = [
        { id: 1, guestName: 'John Doe', overallRating: 4.5, isApproved: true }
      ];

      mockReviewService.getApprovedReviews.mockResolvedValue(mockApprovedReviews as any);

      const result = await reviewController.getApprovedReviews(mockRequest as Request);

      expect(mockReviewService.getApprovedReviews).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockApprovedReviews);
    });
  });

  describe('updateReviewApproval', () => {
    it('should update review approval', async () => {
      mockRequest.params = { reviewId: '1' };
      mockRequest.body = { isApproved: true };

      mockReviewService.updateReviewApproval.mockResolvedValue(true);

      const result = await reviewController.updateReviewApproval(mockRequest as Request);

      expect(mockReviewService.updateReviewApproval).toHaveBeenCalledWith(1, true);
      expect(result).toEqual({ success: true, reviewId: 1, isApproved: true });
    });
  });
}); 