interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryIf?: (error: any) => boolean;
  onRetry?: (error: any, retryCount: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryIf: (error) => {
    // Retry on network errors and 5xx status codes
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return true;
    }
    if (error.response?.status >= 500) {
      return true;
    }
    // Retry on timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return true;
    }
    return false;
  },
  onRetry: () => {}
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if we've exhausted attempts
      if (attempt === opts.maxRetries) {
        throw error;
      }
      
      // Don't retry if the error doesn't match our criteria
      if (!opts.retryIf(error)) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );
      
      // Notify about retry
      opts.onRetry(error, attempt + 1);
      
      // Wait before retrying
      await sleep(delay);
    }
  }
  
  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry decorator for class methods
export function retry(options?: RetryOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      return withRetry(() => originalMethod.apply(this, args), options);
    };
    
    return descriptor;
  };
}

// Create a retry wrapper for fetch
export function createRetryableFetch(options?: RetryOptions) {
  return async function retryableFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    return withRetry(async () => {
      const response = await fetch(input, init);
      
      // Throw on 5xx errors to trigger retry
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return response;
    }, options);
  };
}

// Circuit breaker pattern for preventing cascading failures
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private resetTimeout: number = 30000 // 30 seconds
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    if (this.state === 'half-open') {
      this.state = 'closed';
    }
    this.failures = 0;
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
  
  reset() {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

// Retry with circuit breaker
export function createResilientFetch(
  retryOptions?: RetryOptions,
  circuitBreakerOptions?: {
    threshold?: number;
    timeout?: number;
    resetTimeout?: number;
  }
) {
  const circuitBreaker = new CircuitBreaker(
    circuitBreakerOptions?.threshold,
    circuitBreakerOptions?.timeout,
    circuitBreakerOptions?.resetTimeout
  );
  
  return async function resilientFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    return circuitBreaker.execute(() =>
      withRetry(async () => {
        const response = await fetch(input, init);
        
        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        return response;
      }, retryOptions)
    );
  };
}