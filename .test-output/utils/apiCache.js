"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiCache = void 0;
exports.withCache = withCache;
class APICache {
    constructor() {
        this.cache = new Map();
        this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
    }
    generateKey(url, params) {
        const paramString = params ? JSON.stringify(params) : '';
        return `${url}:${paramString}`;
    }
    get(url, params) {
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
    set(url, data, params, ttl) {
        const key = this.generateKey(url, params);
        const cacheTTL = ttl || this.DEFAULT_TTL;
        const entry = {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + cacheTTL
        };
        this.cache.set(key, entry);
    }
    invalidate(url, params) {
        const key = this.generateKey(url, params);
        this.cache.delete(key);
    }
    invalidatePattern(pattern) {
        const keysToDelete = [];
        this.cache.forEach((_, key) => {
            if (key.includes(pattern)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }
    clear() {
        this.cache.clear();
    }
    // Clean up expired entries
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        this.cache.forEach((entry, key) => {
            if (now > entry.expiry) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }
    // Get cache statistics
    getStats() {
        const now = Date.now();
        const entries = [];
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
exports.apiCache = new APICache();
// Clean up expired entries every 10 minutes
setInterval(() => {
    exports.apiCache.cleanup();
}, 10 * 60 * 1000);
// Higher-order function to add caching to API calls
function withCache(fn, cacheKey, ttl) {
    return (async (...args) => {
        const key = `${cacheKey}:${JSON.stringify(args)}`;
        // Try to get from cache first
        const cached = exports.apiCache.get(key);
        if (cached !== null) {
            console.log(`Cache hit for ${key}`);
            return cached;
        }
        // Call the original function
        console.log(`Cache miss for ${key}, calling API`);
        try {
            const result = await fn(...args);
            // Cache the result
            exports.apiCache.set(key, result, undefined, ttl);
            return result;
        }
        catch (error) {
            // Don't cache errors
            throw error;
        }
    });
}
