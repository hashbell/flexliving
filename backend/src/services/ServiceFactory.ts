import { HostawayReviewRepository } from '../repositories/HostawayReviewRepository';
import { ReviewService } from './ReviewService';
import { ReviewController } from '../controllers/ReviewController';
import { LoggerService } from './LoggerService';
import { ConfigurationService } from './ConfigurationService';
import { ValidationMiddleware } from '../middleware/validationMiddleware';
import { RequestHandlerMiddleware } from '../middleware/requestHandlerMiddleware';

/**
 * Service Factory - Creates service instances with proper dependency injection
 * Simplified from singleton pattern to simple factory function
 */
export function createServices() {
  // Initialize core services first (no dependencies)
  const logger = new LoggerService();
  const configurationService = new ConfigurationService();
  
  // Initialize business services with dependencies
  const reviewRepository = new HostawayReviewRepository(
    configurationService,
    logger
  );
  
  // Initialize main business service (formerly ReviewUseCase)
  const reviewService = new ReviewService(
    reviewRepository,
    logger
  );
  
  // Initialize controller with minimal dependencies
  const reviewController = new ReviewController(
    reviewService,
    logger
  );

  // Initialize middleware with dependencies
  const validationMiddleware = new ValidationMiddleware(logger);
  const requestHandlerMiddleware = new RequestHandlerMiddleware(logger);

  return {
    logger,
    configurationService,
    reviewRepository,
    reviewService,
    reviewController,
    validationMiddleware,
    requestHandlerMiddleware
  };
}
