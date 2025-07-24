// Service Worker Registration Utility
// Handles registration and communication with the service worker

export interface SWConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config?: SWConfig) {
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      return;
    }

    window.addEventListener('load', () => {
      // Use the auto-generated service worker from next-pwa
      const swUrl = `${process.env.PUBLIC_URL || ''}/sw.js`;

      if (isLocalhost) {
        // This is running on localhost. Check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging so developers can see what's happening
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker.'
          );
          
          // Load service worker extensions after main SW is ready
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'LOAD_EXTENSIONS' });
          }
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('[SW] Back online');
      config?.onOnline?.();
      
      // Trigger background sync if available
      navigator.serviceWorker.ready.then((registration) => {
        if ('sync' in registration) {
          (registration as any).sync.register('mlb-sync-preferences').catch((error: Error) => {
            console.log('[SW] Background sync registration failed:', error);
          });
        }
      });
    });

    window.addEventListener('offline', () => {
      console.log('[SW] Offline mode');
      config?.onOffline?.();
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        console.log('[SW] Sync completed:', event.data.data);
        // Notify the app that preferences were synced
        window.dispatchEvent(new CustomEvent('sw-sync-complete', { detail: event.data.data }));
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: SWConfig) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Request periodic background sync for weather updates
      if ('periodicSync' in registration) {
        (registration as any).periodicSync.register({
          tag: 'update-weather',
          minInterval: 30 * 60 * 1000, // 30 minutes
        }).catch((error: Error) => {
          console.log('[SW] Periodic sync registration failed:', error);
        });
      }

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all tabs are closed.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
      config?.onError?.(error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: SWConfig) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      config?.onOffline?.();
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

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