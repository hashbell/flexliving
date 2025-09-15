import { Router } from 'express';
import { createServices } from '../services/ServiceFactory';

const router = Router();

// Create services using factory function (simplified dependency injection)
const { reviewController, validationMiddleware, requestHandlerMiddleware } = createServices();

router.get('/hostaway', 
  requestHandlerMiddleware.handleRequest(
    (req, res) => reviewController.getAllReviews(req),
    'fetch all reviews'
  )
);

router.get('/dashboard', 
  requestHandlerMiddleware.handleRequest(
    (req, res) => reviewController.getDashboardData(req),
    'fetch dashboard data'
  )
);

router.get('/property/:propertyName', 
  validationMiddleware.validatePropertyName,
  requestHandlerMiddleware.handleRequest(
    (req, res) => reviewController.getPropertyReviews(req),
    'fetch reviews for property'
  )
);

router.get('/approved', 
  requestHandlerMiddleware.handleRequest(
    (req, res) => reviewController.getApprovedReviews(req),
    'fetch approved reviews'
  )
);

router.post('/:reviewId/approve',
  validationMiddleware.validateReviewId,
  validationMiddleware.validateReviewApproval,
  requestHandlerMiddleware.handleRequest(
    (req, res) => reviewController.updateReviewApproval(req),
    'update review approval'
  )
);

router.get('/filter',
  validationMiddleware.validateQueryParams,
  requestHandlerMiddleware.handleRequest(
    (req, res) => reviewController.getFilteredReviews(req),
    'fetch filtered reviews'
  )
);

export default router;
