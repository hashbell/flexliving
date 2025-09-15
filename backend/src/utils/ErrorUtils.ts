import { StatusCodes } from 'http-status-codes';

export class ErrorUtils {
  static handleApiError(error: unknown, context: string): {
    status: 'error';
    message: string;
    statusCode?: number;
  } {
    if (error instanceof Error) {
      if (ErrorUtils.isValidationError(error)) {
        return {
          status: 'error',
          message: `Validation failed in ${context.toLowerCase()}: ${error.message}`,
          statusCode: StatusCodes.BAD_REQUEST
        };
      }
      
      if (ErrorUtils.isNotFoundError(error)) {
        return {
          status: 'error',
          message: `Resource not found in ${context.toLowerCase()}: ${error.message}`,
          statusCode: StatusCodes.NOT_FOUND
        };
      }
      
      return {
        status: 'error',
        message: `Failed to ${context.toLowerCase()}: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      };
    }
    
    return {
      status: 'error',
      message: `Failed to ${context.toLowerCase()}`,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };
  }

  static isValidationError(error: unknown): boolean {
    return error instanceof Error && 
           (error.message.includes('validation') || 
            error.message.includes('invalid') ||
            error.message.includes('required'));
  }

  static isNotFoundError(error: unknown): boolean {
    return error instanceof Error && 
           (error.message.includes('not found') || 
            error.message.includes('does not exist'));
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'Unknown error occurred';
  }

  static getStatusCodeForError(error: unknown): number {
    if (ErrorUtils.isValidationError(error)) {
      return StatusCodes.BAD_REQUEST;
    }
    
    if (ErrorUtils.isNotFoundError(error)) {
      return StatusCodes.NOT_FOUND;
    }
    
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }

  static createErrorResponse(error: unknown, context: string): {
    success: false;
    error: string;
    code: string;
    statusCode: number;
  } {
    const message = ErrorUtils.getErrorMessage(error);
    const statusCode = ErrorUtils.getStatusCodeForError(error);
    
    return {
      success: false,
      error: message,
      code: context.toUpperCase().replace(/\s+/g, '_'),
      statusCode
    };
  }
}
