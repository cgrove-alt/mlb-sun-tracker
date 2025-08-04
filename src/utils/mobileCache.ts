// Mobile-optimized caching utilities
export class MobileCache {
  private static readonly CACHE_VERSION = 'v1';
  static readonly CACHE_NAMES = {
    STATIC: `mlb-static-${MobileCache.CACHE_VERSION}`,
    IMAGES: `mlb-images-${MobileCache.CACHE_VERSION}`,
    API: `mlb-api-${MobileCache.CACHE_VERSION}`,
    OFFLINE: `mlb-offline-${MobileCache.CACHE_VERSION}`,
  };

  // Preload critical resources for mobile
  static async preloadCriticalResources(): Promise<void> {
    if (!('caches' in window)) return;

    const criticalResources = [
      '/manifest.json',
      '/logo192.png',
      '/favicon.ico',
      // Add critical CSS/JS paths
    ];

    try {
      const cache = await caches.open(MobileCache.CACHE_NAMES.STATIC);
      await cache.addAll(criticalResources);
    } catch (error) {
      console.error('Failed to preload critical resources:', error);
    }
  }

  // Implement aggressive caching for images
  static async cacheImage(url: string): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(MobileCache.CACHE_NAMES.IMAGES);
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.error('Failed to cache image:', url, error);
    }
  }

  // Get cached response with fallback
  static async getCachedResponse(request: Request | string): Promise<Response | null> {
    if (!('caches' in window)) return null;

    try {
      const response = await caches.match(request);
      return response || null;
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return null;
    }
  }

  // Clear old caches
  static async clearOldCaches(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      const validCacheNames = Object.values(MobileCache.CACHE_NAMES);
      
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (!validCacheNames.includes(cacheName)) {
            await caches.delete(cacheName);
          }
        })
      );
    } catch (error) {
      console.error('Failed to clear old caches:', error);
    }
  }

  // Get cache size estimate
  static async getCacheSize(): Promise<number> {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return 0;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      console.error('Failed to estimate cache size:', error);
      return 0;
    }
  }

  // Implement smart cache eviction for mobile
  static async smartCacheEviction(maxSizeBytes: number = 50 * 1024 * 1024): Promise<void> {
    const currentSize = await MobileCache.getCacheSize();
    
    if (currentSize > maxSizeBytes) {
      // Clear least recently used caches
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        if (cacheName.includes('api') || cacheName.includes('images')) {
          await caches.delete(cacheName);
          const newSize = await MobileCache.getCacheSize();
          if (newSize < maxSizeBytes) break;
        }
      }
    }
  }
}

// Cache strategy for different resource types
export const CacheStrategy = {
  // Network first, fallback to cache (for API calls)
  networkFirst: async (request: Request): Promise<Response> => {
    try {
      const response = await fetch(request);
      if (response.ok && 'caches' in window) {
        const cache = await caches.open(MobileCache.CACHE_NAMES.API);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cachedResponse = await MobileCache.getCachedResponse(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },

  // Cache first, fallback to network (for static assets)
  cacheFirst: async (request: Request): Promise<Response> => {
    const cachedResponse = await MobileCache.getCachedResponse(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);
    if (response.ok && 'caches' in window) {
      const cacheName = request.url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)
        ? MobileCache.CACHE_NAMES.IMAGES
        : MobileCache.CACHE_NAMES.STATIC;
      
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  },

  // Stale while revalidate (for CSS/JS)
  staleWhileRevalidate: async (request: Request): Promise<Response> => {
    const cachedResponse = await MobileCache.getCachedResponse(request);
    
    const fetchPromise = fetch(request).then(async (response) => {
      if (response.ok && 'caches' in window) {
        const cache = await caches.open(MobileCache.CACHE_NAMES.STATIC);
        cache.put(request, response.clone());
      }
      return response;
    });

    return cachedResponse || fetchPromise;
  },
};

// Initialize mobile cache on app start
export const initializeMobileCache = async (): Promise<void> => {
  await MobileCache.clearOldCaches();
  await MobileCache.preloadCriticalResources();
  
  // Set up periodic cache cleanup
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      MobileCache.smartCacheEviction();
    });
  }
};