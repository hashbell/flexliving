import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoggerService } from '../services/LoggerService';
import { ResponseUtils } from '../utils/ResponseUtils';

export class ValidationMiddleware {
  constructor(private logger: LoggerService) {}

  validateReviewApproval = (req: Request, res: Response, next: NextFunction): void => {
    const { isApproved } = req.body;
    
    if (typeof isApproved !== 'boolean') {
      this.logger.warn('Invalid review approval request: isApproved must be a boolean', 'ValidationMiddleware');
      res.status(StatusCodes.BAD_REQUEST).json(
        ResponseUtils.validationError('isApproved must be a boolean value')
      );
      return;
    }
    
    next();
  };

  validateReviewId = (req: Request, res: Response, next: NextFunction): void => {
    const { reviewId } = req.params;
    
    if (!reviewId) {
      this.logger.warn('Invalid request: reviewId parameter is missing', 'ValidationMiddleware');
      res.status(StatusCodes.BAD_REQUEST).json(
        ResponseUtils.validationError('reviewId parameter is required')
      );
      return;
    }
    
    const id = parseInt(reviewId);
    if (isNaN(id) || id <= 0) {
      this.logger.warn(`Invalid review ID: ${reviewId}`, 'ValidationMiddleware');
      res.status(StatusCodes.BAD_REQUEST).json(
        ResponseUtils.validationError('reviewId must be a positive integer')
      );
      return;
    }
    
    // Add validated ID to request for use in controller
    req.params.reviewId = id.toString();
    
    next();
  };

  validatePropertyName = (req: Request, res: Response, next: NextFunction): void => {
    const { propertyName } = req.params;
    
    if (!propertyName || propertyName.trim().length === 0) {
      this.logger.warn('Invalid request: propertyName parameter is missing or empty', 'ValidationMiddleware');
      res.status(StatusCodes.BAD_REQUEST).json(
        ResponseUtils.validationError('propertyName parameter is required')
      );
      return;
    }
    
    // Sanitize property name
    const sanitizedPropertyName = propertyName.trim();
    req.params.propertyName = sanitizedPropertyName;
    
    next();
  };

  validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
    const { 
      minRating, 
      maxRating, 
      channel, 
      propertyName, 
      dateFrom, 
      dateTo, 
      status 
    } = req.query;
    
    const errors: string[] = [];
    const validatedParams: any = {};
    
    // Validate minRating
    if (minRating !== undefined) {
      const min = parseFloat(minRating as string);
      if (isNaN(min) || min < 1 || min > 5) {
        errors.push('minRating must be a number between 1 and 5');
      } else {
        validatedParams.minRating = min;
      }
    }
    
    // Validate maxRating
    if (maxRating !== undefined) {
      const max = parseFloat(maxRating as string);
      if (isNaN(max) || max < 1 || max > 5) {
        errors.push('maxRating must be a number between 1 and 5');
      } else {
        validatedParams.maxRating = max;
      }
    }
    
    // Validate rating range
    if (validatedParams.minRating && validatedParams.maxRating) {
      if (validatedParams.minRating > validatedParams.maxRating) {
        errors.push('minRating cannot be greater than maxRating');
      }
    }
    
    // Validate channel
    if (channel !== undefined) {
      const channelStr = channel as string;
      if (typeof channelStr !== 'string' || channelStr.trim().length === 0) {
        errors.push('channel must be a non-empty string');
      } else {
        validatedParams.channel = channelStr.trim();
      }
    }
    
    // Validate propertyName
    if (propertyName !== undefined) {
      const propName = propertyName as string;
      if (typeof propName !== 'string' || propName.trim().length === 0) {
        errors.push('propertyName must be a non-empty string');
      } else {
        validatedParams.propertyName = propName.trim();
      }
    }
    
    // Validate dateFrom
    if (dateFrom !== undefined) {
      const date = new Date(dateFrom as string);
      if (isNaN(date.getTime())) {
        errors.push('dateFrom must be a valid date (YYYY-MM-DD format)');
      } else {
        validatedParams.dateFrom = date;
      }
    }
    
    // Validate dateTo
    if (dateTo !== undefined) {
      const date = new Date(dateTo as string);
      if (isNaN(date.getTime())) {
        errors.push('dateTo must be a valid date (YYYY-MM-DD format)');
      } else {
        validatedParams.dateTo = date;
      }
    }
    
    // Validate date range
    if (validatedParams.dateFrom && validatedParams.dateTo) {
      if (validatedParams.dateFrom > validatedParams.dateTo) {
        errors.push('dateFrom cannot be after dateTo');
      }
    }
    
    // Validate status
    if (status !== undefined) {
      const statusStr = status as string;
      const validStatuses = ['published', 'pending', 'rejected'];
      if (!validStatuses.includes(statusStr)) {
        errors.push(`status must be one of: ${validStatuses.join(', ')}`);
      } else {
        validatedParams.status = statusStr;
      }
    }
    
    if (errors.length > 0) {
      this.logger.warn(`Query parameter validation failed: ${errors.join(', ')}`, 'ValidationMiddleware');
      res.status(StatusCodes.BAD_REQUEST).json(
        ResponseUtils.validationError(errors.join('; '))
      );
      return;
    }
    
    // Add validated parameters to request for use in controller
    req.query = validatedParams;
    
    next();
  };
}
