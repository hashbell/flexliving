
export class ResponseUtils {
  /**
   * Format successful API response
   */
  static success<T>(data: T, count?: number): {
    success: true;
    data: T;
    count?: number;
  } {
    const response: any = {
      success: true,
      data
    };
    
    if (count !== undefined) {
      response.count = count;
    }
    
    return response;
  }

  /**
   * Format validation error response
   */
  static validationError(message: string): {
    success: false;
    error: string;
    code: string;
  } {
    return {
      success: false,
      error: message,
      code: 'VALIDATION_ERROR'
    };
  }

  /**
   * Format general error response
   */
  static error(message: string, code: string = 'INTERNAL_ERROR'): {
    success: false;
    error: string;
    code: string;
  } {
    return {
      success: false,
      error: message,
      code
    };
  }

  /**
   * Format not found error response
   */
  static notFound(resource: string): {
    success: false;
    error: string;
    code: string;
  } {
    return {
      success: false,
      error: `${resource} not found`,
      code: 'NOT_FOUND'
    };
  }

  /**
   * Format unauthorized error response
   */
  static unauthorized(message: string = 'Unauthorized access'): {
    success: false;
    error: string;
    code: string;
  } {
    return {
      success: false,
      error: message,
      code: 'UNAUTHORIZED'
    };
  }

  /**
   * Format forbidden error response
   */
  static forbidden(message: string = 'Access forbidden'): {
    success: false;
    error: string;
    code: string;
  } {
    return {
      success: false,
      error: message,
      code: 'FORBIDDEN'
    };
  }

  /**
   * Format conflict error response
   */
  static conflict(message: string): {
    success: false;
    error: string;
    code: string;
  } {
    return {
      success: false,
      error: message,
      code: 'CONFLICT'
    };
  }

  /**
   * Format bad request error response
   */
  static badRequest(message: string): {
    success: false;
    error: string;
    code: string;
  } {
    return {
      success: false,
      error: message,
      code: 'BAD_REQUEST'
    };
  }
}
