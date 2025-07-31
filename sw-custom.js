// MLB Sun Tracker - Custom Service Worker Extensions
// This file extends the auto-generated service worker with additional functionality

// Import workbox libraries (these are available from the generated SW)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Cache names
const STADIUM_CACHE = 'mlb-stadium-data-v1';
const OFFLINE_CACHE = 'mlb-offline-v1';
const SYNC_TAG = 'mlb-sync-preferences';

// Stadium data that should always be available offline
const CRITICAL_STADIUM_DATA = [
  '/api/stadiums',
  '/api/stadium-sections',
  '/data/stadiums.json',
  '/data/stadium-sections.json',
];

// Install event - cache critical stadium data
self.addEventListener('install', (event) => {
  console.log('[SW Custom] Installing custom service worker extensions...');
  
  event.waitUntil(
    caches.open(STADIUM_CACHE).then((cache) => {
      console.log('[SW Custom] Caching stadium data...');
      // Cache all stadium-related data
      return Promise.all([
        // Cache stadium data API endpoints
        fetch('/api/stadiums').then(response => {
          if (response.ok) {
            return cache.put('/api/stadiums', response);
          }
        }).catch(err => console.log('Failed to cache stadium data:', err)),
        
        // Cache static stadium data if available
        ...CRITICAL_STADIUM_DATA.map(url => 
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch(() => {
            // Silently fail for missing resources
          })
        )
      ]);
    })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW Custom] Activating custom service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Clean up old versions of our custom caches
          if (cacheName.startsWith('mlb-stadium-data-') && cacheName !== STADIUM_CACHE) {
            console.log('[SW Custom] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
          if (cacheName.startsWith('mlb-offline-') && cacheName !== OFFLINE_CACHE) {
            console.log('[SW Custom] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - handle offline functionality and cache headers
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Check if this is a static asset that should be cached long-term
  const isStaticAsset = url.pathname.includes('/_next/static/') ||
                       url.pathname.match(/\.(js|css|woff2|jpg|jpeg|png|gif|svg|ico|webp)$/);
  
  // Handle static assets with aggressive caching
  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Clone the response to modify headers
          const response = new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: new Headers(cachedResponse.headers)
          });
          
          // Set aggressive cache headers
          response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          response.headers.set('X-SW-Cache', 'HIT');
          
          return response;
        }
        
        // No cache, fetch from network
        return fetch(request).then((response) => {
          if (response.ok) {
            // Clone response for caching
            const responseToCache = response.clone();
            const responseToReturn = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: new Headers(response.headers)
            });
            
            // Set cache headers on returned response
            responseToReturn.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
            responseToReturn.headers.set('X-SW-Cache', 'MISS');
            
            // Cache the response
            caches.open('static-assets-v1').then((cache) => {
              cache.put(request, responseToCache);
            });
            
            return responseToReturn;
          }
          return response;
        });
      })
    );
    return;
  }
  
  // Handle stadium data requests
  if (url.pathname.includes('/stadium') || url.pathname.includes('/api/stadiums')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update in background
          fetch(request).then((freshResponse) => {
            if (freshResponse.ok) {
              caches.open(STADIUM_CACHE).then((cache) => {
                cache.put(request, freshResponse.clone());
              });
            }
          }).catch(() => {
            // Silently fail background update
          });
          
          return cachedResponse;
        }
        
        // No cache, try network
        return fetch(request).then((response) => {
          if (response.ok) {
            // Cache successful response
            const responseToCache = response.clone();
            caches.open(STADIUM_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          // Network failed, return offline fallback
          return new Response(
            JSON.stringify({ error: 'Offline - Stadium data unavailable' }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
      })
    );
    return;
  }
  
  // Handle user preference sync
  if (url.pathname.includes('/api/preferences') && request.method === 'POST') {
    event.respondWith(
      fetch(request.clone()).then((response) => {
        return response;
      }).catch(() => {
        // Failed to sync, register for background sync
        if ('sync' in self.registration) {
          // Store the request for later
          return request.json().then((data) => {
            return savePreferencesForSync(data).then(() => {
              self.registration.sync.register(SYNC_TAG);
              return new Response(
                JSON.stringify({ queued: true, message: 'Preferences will sync when online' }),
                {
                  status: 202,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
          });
        }
        
        // No background sync support
        return new Response(
          JSON.stringify({ error: 'Offline - Cannot save preferences' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[SW Custom] Background sync triggered:', event.tag);
  
  if (event.tag === SYNC_TAG) {
    event.waitUntil(
      syncPreferences().then(() => {
        console.log('[SW Custom] Preferences synced successfully');
        // Notify clients of successful sync
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SYNC_COMPLETE',
              data: { preferences: true }
            });
          });
        });
      }).catch((error) => {
        console.error('[SW Custom] Sync failed:', error);
      })
    );
  }
});

// Message event - handle client communications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_STADIUM_DATA') {
    // Cache specific stadium data on demand
    const { stadiumId } = event.data;
    
    caches.open(STADIUM_CACHE).then((cache) => {
      const urls = [
        `/api/stadium/${stadiumId}`,
        `/api/stadium/${stadiumId}/sections`,
        `/api/stadium/${stadiumId}/weather`
      ];
      
      Promise.all(
        urls.map(url => 
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch(() => {})
        )
      ).then(() => {
        event.ports[0].postMessage({ 
          type: 'CACHE_COMPLETE', 
          stadiumId 
        });
      });
    });
  }
  
  // Handle static asset caching with custom TTL
  if (event.data && event.data.type === 'CACHE_STATIC_ASSET') {
    const { url, ttl } = event.data;
    
    caches.open('static-assets-v1').then((cache) => {
      // Check if already cached
      cache.match(url).then((response) => {
        if (!response) {
          // Fetch and cache with headers
          fetch(url).then((fetchResponse) => {
            if (fetchResponse.ok) {
              cache.put(url, fetchResponse);
            }
          });
        }
      });
    });
  }
});

// Helper functions
async function savePreferencesForSync(data) {
  const cache = await caches.open(OFFLINE_CACHE);
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put('pending-preferences', response);
}

async function syncPreferences() {
  const cache = await caches.open(OFFLINE_CACHE);
  const pendingResponse = await cache.match('pending-preferences');
  
  if (!pendingResponse) {
    return;
  }
  
  const preferences = await pendingResponse.json();
  
  // Attempt to sync with server
  const response = await fetch('/api/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences)
  });
  
  if (response.ok) {
    // Clear pending preferences
    await cache.delete('pending-preferences');
  } else {
    throw new Error('Failed to sync preferences');
  }
}

// Periodic background sync for weather data
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-weather') {
      event.waitUntil(
        updateWeatherCache().catch((error) => {
          console.error('[SW Custom] Weather update failed:', error);
        })
      );
    }
  });
}

async function updateWeatherCache() {
  const cache = await caches.open('weather-api-cache');
  
  // Get all cached stadium weather endpoints
  const keys = await cache.keys();
  const weatherKeys = keys.filter(key => key.url.includes('/weather'));
  
  // Update each weather endpoint
  for (const key of weatherKeys) {
    try {
      const response = await fetch(key);
      if (response.ok) {
        await cache.put(key, response);
      }
    } catch (error) {
      console.error('[SW Custom] Failed to update weather for:', key.url);
    }
  }
}

console.log('[SW Custom] Custom service worker extensions loaded');