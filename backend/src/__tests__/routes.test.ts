import request from 'supertest';
import express from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { ReviewService } from '../services/ReviewService';
import { LoggerService } from '../services/LoggerService';

// Mock dependencies
jest.mock('../services/ReviewService');
jest.mock('../services/LoggerService');

describe('API Routes', () => {
  let app: express.Application;
  let mockReviewService: jest.Mocked<ReviewService>;
  let reviewController: ReviewController;

  beforeEach(() => {
    const mockLogger = {} as LoggerService;
    mockReviewService = new ReviewService({} as any, mockLogger) as jest.Mocked<ReviewService>;
    reviewController = new ReviewController(mockReviewService, mockLogger);

    app = express();
    app.use(express.json());

    // Mock routes with proper async handling
    app.get('/api/reviews', async (req, res) => {
      try {
        const result = await reviewController.getAllReviews(req);
        res.json({ success: true, data: result });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    });

    app.get('/api/reviews/approved', async (req, res) => {
      try {
        const result = await reviewController.getApprovedReviews(req);
        res.json({ success: true, data: result });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    });

    app.post('/api/reviews/:reviewId/approve', async (req, res) => {
      try {
        const result = await reviewController.updateReviewApproval(req);
        res.json({ success: true, data: result });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    });
  });

  describe('GET /api/reviews', () => {
    it('should return all reviews', async () => {
      const mockReviews = [
        {
          id: 1,
          guestName: 'John Doe',
          overallRating: 4.5,
          type: 'guest-to-host' as const,
          status: 'published' as const,
          publicReview: 'Great stay!',
          categories: [],
          propertyName: 'Test Property',
          channel: 'Airbnb',
          submittedAt: '2024-01-01',
          isApproved: true
        }
      ];

      mockReviewService.getAllReviews.mockResolvedValue(mockReviews as any);

      const response = await request(app)
        .get('/api/reviews')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockReviews);
    });
  });

  describe('GET /api/reviews/approved', () => {
    it('should return approved reviews', async () => {
      const mockApprovedReviews = [
        {
          id: 1,
          guestName: 'John Doe',
          overallRating: 4.5,
          type: 'guest-to-host' as const,
          status: 'published' as const,
          publicReview: 'Great stay!',
          categories: [],
          propertyName: 'Test Property',
          channel: 'Airbnb',
          submittedAt: '2024-01-01',
          isApproved: true
        }
      ];

      mockReviewService.getApprovedReviews.mockResolvedValue(mockApprovedReviews as any);

      const response = await request(app)
        .get('/api/reviews/approved')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockApprovedReviews);
    });
  });

  describe('POST /api/reviews/:reviewId/approve', () => {
    it('should update review approval', async () => {
      mockReviewService.updateReviewApproval.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/reviews/1/approve')
        .send({ isApproved: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({ success: true, reviewId: 1, isApproved: true });
      expect(mockReviewService.updateReviewApproval).toHaveBeenCalledWith(1, true);
    });
  });
}); 