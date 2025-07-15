interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${paramString}`;
  }

  get<T>(url: string, params?: Record<string, any>): T | null {
    const key = this.generateKey(url, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(url: string, data: T, params?: Record<string, any>, ttl?: number): void {
    const key = this.generateKey(url, params);
    const cacheTTL = ttl || this.DEFAULT_TTL;
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + cacheTTL
    };

    this.cache.set(key, entry);
  }

  invalidate(url: string, params?: Record<string, any>): void {
    const key = this.generateKey(url, params);
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (now > entry.expiry) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Get cache statistics
  getStats(): { size: number; entries: Array<{ key: string; age: number; ttl: number }> } {
    const now = Date.now();
    const entries: Array<{ key: string; age: number; ttl: number }> = [];
    this.cache.forEach((entry, key) => {
      entries.push({
        key,
        age: now - entry.timestamp,
        ttl: entry.expiry - now
      });
    });

    return {
      size: this.cache.size,
      entries
    };
  }
}

// Global cache instance
export const apiCache = new APICache();

// Clean up expired entries every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

// Higher-order function to add caching to API calls
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = `${cacheKey}:${JSON.stringify(args)}`;
    
    // Try to get from cache first
    const cached = apiCache.get(key);
    if (cached !== null) {
      console.log(`Cache hit for ${key}`);
      return cached;
    }

    // Call the original function
    console.log(`Cache miss for ${key}, calling API`);
    try {
      const result = await fn(...args);
      
      // Cache the result
      apiCache.set(key, result, undefined, ttl);
      
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }) as T;
}