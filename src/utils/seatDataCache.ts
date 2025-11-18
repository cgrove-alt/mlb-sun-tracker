/**
 * LocalStorage caching for seat data
 * Reduces network requests for frequently accessed sections
 * Maintains 100% accuracy with TTL-based expiration
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

const CACHE_VERSION = '1.0.0';
const CACHE_PREFIX = 'seat_data_';
const METADATA_PREFIX = 'metadata_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB max cache size

class SeatDataCache {
  private isAvailable: boolean;

  constructor() {
    // Check if localStorage is available
    this.isAvailable = this.checkLocalStorageAvailability();

    if (this.isAvailable) {
      // Clean up expired entries on initialization
      this.cleanupExpiredEntries();
    }
  }

  /**
   * Check if localStorage is available and working
   */
  private checkLocalStorageAvailability(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      console.warn('LocalStorage not available - caching disabled');
      return false;
    }
  }

  /**
   * Generate cache key for seat data
   */
  private getSeatDataKey(stadiumId: string, sectionId: string): string {
    return `${CACHE_PREFIX}${stadiumId}_${sectionId}`;
  }

  /**
   * Generate cache key for metadata
   */
  private getMetadataKey(stadiumId: string): string {
    return `${METADATA_PREFIX}${stadiumId}`;
  }

  /**
   * Store seat data in cache
   */
  public setSeatData<T>(stadiumId: string, sectionId: string, data: T): void {
    if (!this.isAvailable) return;

    try {
      const key = this.getSeatDataKey(stadiumId, sectionId);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };

      const serialized = JSON.stringify(entry);

      // Check if we have space
      if (this.wouldExceedQuota(serialized)) {
        this.makeSpace(serialized.length);
      }

      localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn('Failed to cache seat data:', error);
      // If quota exceeded, try to clean up and retry once
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanupOldestEntries(5); // Remove 5 oldest entries
        try {
          const key = this.getSeatDataKey(stadiumId, sectionId);
          localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now(),
            version: CACHE_VERSION
          }));
        } catch {
          // Give up if still failing
        }
      }
    }
  }

  /**
   * Get seat data from cache
   */
  public getSeatData<T>(stadiumId: string, sectionId: string): T | null {
    if (!this.isAvailable) return null;

    try {
      const key = this.getSeatDataKey(stadiumId, sectionId);
      const stored = localStorage.getItem(key);

      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);

      // Check version compatibility
      if (entry.version !== CACHE_VERSION) {
        localStorage.removeItem(key);
        return null;
      }

      // Check if expired
      if (Date.now() - entry.timestamp > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }

      // Update timestamp for LRU
      entry.timestamp = Date.now();
      localStorage.setItem(key, JSON.stringify(entry));

      return entry.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  /**
   * Store metadata in cache
   */
  public setMetadata<T>(stadiumId: string, metadata: T): void {
    if (!this.isAvailable) return;

    try {
      const key = this.getMetadataKey(stadiumId);
      const entry: CacheEntry<T> = {
        data: metadata,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };

      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache metadata:', error);
    }
  }

  /**
   * Get metadata from cache
   */
  public getMetadata<T>(stadiumId: string): T | null {
    if (!this.isAvailable) return null;

    try {
      const key = this.getMetadataKey(stadiumId);
      const stored = localStorage.getItem(key);

      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);

      // Check version and expiration
      if (entry.version !== CACHE_VERSION || Date.now() - entry.timestamp > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  /**
   * Check if adding data would exceed quota
   */
  private wouldExceedQuota(data: string): boolean {
    try {
      // Estimate current usage
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(METADATA_PREFIX))) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }

      return totalSize + data.length > MAX_CACHE_SIZE;
    } catch {
      return false;
    }
  }

  /**
   * Make space by removing oldest entries
   */
  private makeSpace(requiredSpace: number): void {
    const entries: Array<{ key: string; timestamp: number; size: number }> = [];

    // Collect all cache entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(METADATA_PREFIX))) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const entry = JSON.parse(value);
            entries.push({
              key,
              timestamp: entry.timestamp || 0,
              size: key.length + value.length
            });
          } catch {
            // Invalid entry, remove it
            localStorage.removeItem(key);
          }
        }
      }
    }

    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest entries until we have enough space
    let freedSpace = 0;
    for (const entry of entries) {
      if (freedSpace >= requiredSpace) break;
      localStorage.removeItem(entry.key);
      freedSpace += entry.size;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpiredEntries(): void {
    if (!this.isAvailable) return;

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(METADATA_PREFIX))) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const entry = JSON.parse(value);
            if (!entry.timestamp ||
                Date.now() - entry.timestamp > CACHE_TTL ||
                entry.version !== CACHE_VERSION) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // Invalid entry, mark for removal
          keysToRemove.push(key);
        }
      }
    }

    // Remove expired entries
    keysToRemove.forEach(key => localStorage.removeItem(key));

    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} expired cache entries`);
    }
  }

  /**
   * Remove oldest entries
   */
  private cleanupOldestEntries(count: number): void {
    const entries: Array<{ key: string; timestamp: number }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(METADATA_PREFIX))) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const entry = JSON.parse(value);
            entries.push({
              key,
              timestamp: entry.timestamp || 0
            });
          }
        } catch {
          // Invalid entry
        }
      }
    }

    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest entries
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      localStorage.removeItem(entries[i].key);
    }
  }

  /**
   * Clear all cached data
   */
  public clearAll(): void {
    if (!this.isAvailable) return;

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(METADATA_PREFIX))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${keysToRemove.length} cache entries`);
  }

  /**
   * Get cache statistics
   */
  public getStats(): {
    entries: number;
    totalSize: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
  } {
    if (!this.isAvailable) {
      return { entries: 0, totalSize: 0, oldestEntry: null, newestEntry: null };
    }

    let entries = 0;
    let totalSize = 0;
    let oldest = Infinity;
    let newest = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(METADATA_PREFIX))) {
        const value = localStorage.getItem(key);
        if (value) {
          entries++;
          totalSize += key.length + value.length;

          try {
            const entry = JSON.parse(value);
            if (entry.timestamp) {
              oldest = Math.min(oldest, entry.timestamp);
              newest = Math.max(newest, entry.timestamp);
            }
          } catch {
            // Invalid entry
          }
        }
      }
    }

    return {
      entries,
      totalSize,
      oldestEntry: oldest === Infinity ? null : new Date(oldest),
      newestEntry: newest === 0 ? null : new Date(newest)
    };
  }
}

// Export singleton instance
export const seatDataCache = new SeatDataCache();