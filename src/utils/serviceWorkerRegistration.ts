// Service Worker helper utilities.
//
// NOTE: service-worker REGISTRATION and the silent auto-update behavior live in
// the single owner `components/ServiceWorkerRegistration.tsx` (mounted in the
// root layout). This file used to contain a second, competing CRA-style
// `register()` path with its own update prompt — that was dead code (nothing
// called it) and was removed when the registration paths were reconciled.
// This file now holds only SW-adjacent helpers (offline state, cache info).

// Helper function to cache a specific stadium's data
export async function cacheStadiumData(stadiumId: string): Promise<void> {
  if (!navigator.serviceWorker.controller) {
    throw new Error('Service worker not active');
  }

  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_COMPLETE') {
        resolve();
      } else {
        reject(new Error('Failed to cache stadium data'));
      }
    };

    navigator.serviceWorker.controller!.postMessage(
      {
        type: 'CACHE_STADIUM_DATA',
        stadiumId,
      },
      [messageChannel.port2]
    );
  });
}

// Check if we're currently offline
export function isOffline(): boolean {
  return !navigator.onLine;
}

// Get cache storage info
export async function getCacheInfo(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;

    return { usage, quota, percentage };
  }

  return { usage: 0, quota: 0, percentage: 0 };
}

// Clear specific cache
export async function clearCache(cacheName: string): Promise<void> {
  if ('caches' in window) {
    await caches.delete(cacheName);
  }
}

// Clear all app caches
export async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
  }
}
