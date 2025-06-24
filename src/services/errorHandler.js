// Centralized error handling service
class ErrorHandlerService {
  constructor() {
    this.errorTypes = {
      NETWORK_ERROR: 'NETWORK_ERROR',
      API_ERROR: 'API_ERROR',
      RATE_LIMIT: 'RATE_LIMIT',
      NOT_FOUND: 'NOT_FOUND',
      VALIDATION_ERROR: 'VALIDATION_ERROR',
      CACHE_ERROR: 'CACHE_ERROR',
      TIMEOUT_ERROR: 'TIMEOUT_ERROR',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    };

    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      backoffFactor: 2
    };

    this.errorLog = [];
    this.maxLogSize = 100;
  }

  // Main error handling method
  handleError(error, context = {}) {
    const processedError = this.processError(error, context);
    this.logError(processedError);
    
    return {
      type: processedError.type,
      message: processedError.userMessage,
      details: processedError.details,
      canRetry: processedError.canRetry,
      retryAfter: processedError.retryAfter
    };
  }

  // Process and categorize errors
  processError(error, context) {
    const timestamp = new Date().toISOString();
    const baseError = {
      timestamp,
      context,
      originalError: error,
      canRetry: false,
      retryAfter: null
    };

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        ...baseError,
        type: this.errorTypes.NETWORK_ERROR,
        userMessage: 'Network connection failed. Please check your internet connection and try again.',
        details: 'Failed to connect to the server',
        canRetry: true
      };
    }

    // Rate limiting
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      const retryAfter = this.extractRetryAfter(error.message);
      return {
        ...baseError,
        type: this.errorTypes.RATE_LIMIT,
        userMessage: `Rate limit exceeded. Please try again ${retryAfter ? `after ${retryAfter}` : 'later'}.`,
        details: 'API rate limit reached',
        canRetry: true,
        retryAfter
      };
    }

    // Not found errors
    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        ...baseError,
        type: this.errorTypes.NOT_FOUND,
        userMessage: 'User not found. Please check the username and try again.',
        details: 'The requested user profile could not be found',
        canRetry: false
      };
    }

    // Validation errors
    if (error.message.includes('invalid') || error.message.includes('validation')) {
      return {
        ...baseError,
        type: this.errorTypes.VALIDATION_ERROR,
        userMessage: 'Invalid input. Please check your data and try again.',
        details: error.message,
        canRetry: false
      };
    }

    // API errors
    if (error.message.includes('API') || error.message.includes('GraphQL')) {
      return {
        ...baseError,
        type: this.errorTypes.API_ERROR,
        userMessage: 'Service temporarily unavailable. Please try again later.',
        details: error.message,
        canRetry: true
      };
    }

    // Cache errors
    if (error.message.includes('cache') || error.message.includes('storage')) {
      return {
        ...baseError,
        type: this.errorTypes.CACHE_ERROR,
        userMessage: 'Data storage error. Your request will proceed without caching.',
        details: error.message,
        canRetry: false
      };
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.name === 'TimeoutError') {
      return {
        ...baseError,
        type: this.errorTypes.TIMEOUT_ERROR,
        userMessage: 'Request timed out. Please try again.',
        details: 'The request took too long to complete',
        canRetry: true
      };
    }

    // Unknown errors
    return {
      ...baseError,
      type: this.errorTypes.UNKNOWN_ERROR,
      userMessage: 'An unexpected error occurred. Please try again.',
      details: error.message || 'Unknown error',
      canRetry: true
    };
  }

  // Extract retry-after time from error messages
  extractRetryAfter(message) {
    const patterns = [
      /try again after (\d+) seconds?/i,
      /retry after (\d+) minutes?/i,
      /wait (\d+) seconds?/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        if (pattern.source.includes('minute')) {
          return `${value} minute${value !== 1 ? 's' : ''}`;
        }
        return `${value} second${value !== 1 ? 's' : ''}`;
      }
    }

    return null;
  }

  // Retry mechanism with exponential backoff
  async withRetry(operation, context = {}) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const processedError = this.processError(error, { ...context, attempt });
        
        // Don't retry if error is not retryable
        if (!processedError.canRetry || attempt === this.retryConfig.maxRetries) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffFactor, attempt),
          this.retryConfig.maxDelay
        );

        // Add jitter to prevent thundering herd
        const jitteredDelay = delay + Math.random() * 1000;
        
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${Math.round(jitteredDelay)}ms:`, processedError.userMessage);
        await this.delay(jitteredDelay);
      }
    }

    throw lastError;
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Log errors for debugging and monitoring
  logError(error) {
    // Add to in-memory log
    this.errorLog.unshift(error);
    console.error('Full original error:', error.originalError); // Add this line
    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console logging based on error type
    if (error.type === this.errorTypes.UNKNOWN_ERROR) {
      console.error('Unknown error:', error);
    } else if (error.type === this.errorTypes.NETWORK_ERROR) {
      console.warn('Network error:', error.userMessage);
    } else {
      console.info('Handled error:', error.userMessage);
    }

    // In production, you might want to send errors to a monitoring service
    this.sendToMonitoring(error);
  }

  // Send errors to monitoring service (placeholder)
  sendToMonitoring(error) {
    // This would integrate with services like Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error.originalError);
    }
  }

  // Get error statistics
  getErrorStats() {
    const stats = {};
    
    this.errorLog.forEach(error => {
      stats[error.type] = (stats[error.type] || 0) + 1;
    });

    const total = this.errorLog.length;
    const last24Hours = this.errorLog.filter(error => 
      Date.now() - new Date(error.timestamp).getTime() < 24 * 60 * 60 * 1000
    ).length;

    return {
      total,
      last24Hours,
      byType: stats,
      recentErrors: this.errorLog.slice(0, 10)
    };
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }

  // Create user-friendly error messages
  createUserMessage(error, context = {}) {
    const processed = this.processError(error, context);
    
    let message = processed.userMessage;
    
    // Add context-specific information
    if (context.service === 'github') {
      message += ' This may be due to GitHub API limitations or the user profile being private.';
    } else if (context.service === 'leetcode') {
      message += ' This may be due to LeetCode API limitations or the user profile being private.';
    }

    // Add retry information
    if (processed.canRetry) {
      message += ' You can try again or contact support if the problem persists.';
    }

    return message;
  }

  // Validate input before API calls
  validateInput(input, type) {
    const validations = {
      username: (value) => {
        if (!value || typeof value !== 'string') {
          throw new Error('Username is required and must be a string');
        }
        if (value.length < 1 || value.length > 39) {
          throw new Error('Username must be between 1 and 39 characters');
        }
        if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value)) {
          throw new Error('Username contains invalid characters');
        }
      },
      email: (value) => {
        if (!value || typeof value !== 'string') {
          throw new Error('Email is required and must be a string');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          throw new Error('Invalid email format');
        }
      }
    };

    const validator = validations[type];
    if (validator) {
      validator(input);
    }
  }

  // Circuit breaker pattern for failing services
  createCircuitBreaker(service, options = {}) {
    const config = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000, // 1 minute
      monitoringPeriod: options.monitoringPeriod || 300000 // 5 minutes
    };

    return {
      state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
      failures: 0,
      lastFailureTime: null,
      
      async execute(operation) {
        if (this.state === 'OPEN') {
          if (Date.now() - this.lastFailureTime > config.resetTimeout) {
            this.state = 'HALF_OPEN';
          } else {
            throw new Error(`Circuit breaker is OPEN for ${service}`);
          }
        }

        try {
          const result = await operation();
          
          if (this.state === 'HALF_OPEN') {
            this.state = 'CLOSED';
            this.failures = 0;
          }
          
          return result;
        } catch (error) {
          this.failures++;
          this.lastFailureTime = Date.now();
          
          if (this.failures >= config.failureThreshold) {
            this.state = 'OPEN';
          }
          
          throw error;
        }
      }
    };
  }
}

export const errorHandler = new ErrorHandlerService();
export default errorHandler;