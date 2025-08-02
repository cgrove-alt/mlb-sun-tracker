"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
exports.withRetry = withRetry;
exports.sleep = sleep;
exports.retry = retry;
exports.createRetryableFetch = createRetryableFetch;
exports.createResilientFetch = createResilientFetch;
const DEFAULT_OPTIONS = {
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
    onRetry: () => { }
};
async function withRetry(fn, options) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError;
    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
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
            const delay = Math.min(opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt), opts.maxDelay);
            // Notify about retry
            opts.onRetry(error, attempt + 1);
            // Wait before retrying
            await sleep(delay);
        }
    }
    throw lastError;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Retry decorator for class methods
function retry(options) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return withRetry(() => originalMethod.apply(this, args), options);
        };
        return descriptor;
    };
}
// Create a retry wrapper for fetch
function createRetryableFetch(options) {
    return async function retryableFetch(input, init) {
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
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000, // 1 minute
    resetTimeout = 30000 // 30 seconds
    ) {
        this.threshold = threshold;
        this.timeout = timeout;
        this.resetTimeout = resetTimeout;
        this.failures = 0;
        this.lastFailureTime = 0;
        this.state = 'closed';
    }
    async execute(fn) {
        if (this.state === 'open') {
            const now = Date.now();
            if (now - this.lastFailureTime > this.timeout) {
                this.state = 'half-open';
            }
            else {
                throw new Error('Circuit breaker is open');
            }
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        if (this.state === 'half-open') {
            this.state = 'closed';
        }
        this.failures = 0;
    }
    onFailure() {
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
exports.CircuitBreaker = CircuitBreaker;
// Retry with circuit breaker
function createResilientFetch(retryOptions, circuitBreakerOptions) {
    const circuitBreaker = new CircuitBreaker(circuitBreakerOptions?.threshold, circuitBreakerOptions?.timeout, circuitBreakerOptions?.resetTimeout);
    return async function resilientFetch(input, init) {
        return circuitBreaker.execute(() => withRetry(async () => {
            const response = await fetch(input, init);
            if (response.status >= 500) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response;
        }, retryOptions));
    };
}
