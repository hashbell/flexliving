import { ReviewService } from '../ReviewService';
import { HostawayReviewRepository } from '../../repositories/HostawayReviewRepository';
import { LoggerService } from '../LoggerService';

// Mock dependencies
jest.mock('../../repositories/HostawayReviewRepository');
jest.mock('../../utils/AnalyticsUtils');
jest.mock('../LoggerService');

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let mockRepository: jest.Mocked<HostawayReviewRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockRepository = new HostawayReviewRepository({} as any, mockLogger) as jest.Mocked<HostawayReviewRepository>;
    mockLogger = new LoggerService() as jest.Mocked<LoggerService>;
    reviewService = new ReviewService(mockRepository, mockLogger);
  });

  describe('getAllReviews', () => {
    it('should return all reviews from repository', async () => {
      const mockReviews = [
        { id: 1, guestName: 'John Doe', overallRating: 4.5, isApproved: true },
        { id: 2, guestName: 'Jane Smith', overallRating: 3.8, isApproved: false }
      ];

      mockRepository.getAllReviews.mockResolvedValue(mockReviews as any);

      const result = await reviewService.getAllReviews();

      expect(result).toEqual(mockReviews);
      expect(mockRepository.getAllReviews).toHaveBeenCalledTimes(1);
    });
  });

  describe('getApprovedReviews', () => {
    it('should return only approved reviews', async () => {
      const mockApprovedReviews = [
        { id: 1, guestName: 'John Doe', overallRating: 4.5, isApproved: true }
      ];

      mockRepository.getApprovedReviews.mockResolvedValue(mockApprovedReviews as any);

      const result = await reviewService.getApprovedReviews();

      expect(result).toEqual(mockApprovedReviews);
      expect(mockRepository.getApprovedReviews).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateReviewApproval', () => {
    it('should update review approval status', async () => {
      mockRepository.updateReviewApproval.mockResolvedValue(true);

      const result = await reviewService.updateReviewApproval(1, true);

      expect(result).toBe(true);
      expect(mockRepository.updateReviewApproval).toHaveBeenCalledWith(1, true);
    });
  });
}); 