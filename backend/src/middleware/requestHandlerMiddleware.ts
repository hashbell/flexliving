import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoggerService } from '../services/LoggerService';
import { ErrorUtils } from '../utils/ErrorUtils';
import { ResponseUtils } from '../utils/ResponseUtils';

export class RequestHandlerMiddleware {
  constructor(private logger: LoggerService) {}

  handleRequest<T>(
    operation: (req: Request, res: Response) => Promise<T>,
    context: string
  ) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await operation(req, res);
        
        // If result is an array, include count automatically
        const response = Array.isArray(result) 
          ? ResponseUtils.success(result, result.length)
          : ResponseUtils.success(result);
          
        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        const errorResponse = ErrorUtils.handleApiError(error, context);
        this.logger.error(`Failed to ${context.toLowerCase()}`, 'RequestHandlerMiddleware');
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    };
  }

  /**
   * Middleware for operations that don't need request/response parameters
   */
  handleOperation<T>(
    operation: () => Promise<T>,
    context: string
  ) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await operation();
        
        // If result is an array, include count automatically
        const response = Array.isArray(result) 
          ? ResponseUtils.success(result, result.length)
          : ResponseUtils.success(result);
          
        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        const errorResponse = ErrorUtils.handleApiError(error, context);
        this.logger.error(`Failed to ${context.toLowerCase()}`, 'RequestHandlerMiddleware');
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    };
  }
}
