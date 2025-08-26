// MLB Sun Tracker - Service Worker Extensions
// This file adds custom functionality to the PWA service worker

// Enhanced caching for stadium data
const STADIUM_DATA_CACHE = 'mlb-stadium-data-v1';
const OFFLINE_PAGES_CACHE = 'mlb-offline-pages-v1';

// List of essential URLs to cache for offline functionality
const ESSENTIAL_FILES = [
  '/mlb-sun-tracker/',
  '/mlb-sun-tracker/index.html',
  '/mlb-sun-tracker/manifest.json',
];

// Stadium data endpoints that should be cached
const STADIUM_DATA_PATTERNS = [
  /\/api\/stadiums/,
  /\/data\/stadiums/,
  /\/stadium-sections/,
];

// Listen for the install event
self.addEventListener('install', (event) => {
  console.log('[SW Extensions] Installing service worker extensions...');
  
  event.waitUntil(
    Promise.all([
      // Cache essential files
      caches.open(OFFLINE_PAGES_CACHE).then((cache) => {
        return cache.addAll(ESSENTIAL_FILES).catch((error) => {
          console.error('[SW Extensions] Failed to cache essential files:', error);
        });
      }),
      // Pre-cache stadium data
      caches.open(STADIUM_DATA_CACHE).then((cache) => {
        // This would be populated with actual stadium data
        console.log('[SW Extensions] Stadium data cache created');
      })
    ])
  );
});

// Enhanced fetch handling for offline support
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Check if this is a stadium data request
  const isStadiumData = STADIUM_DATA_PATTERNS.some(pattern => pattern.test(url.pathname));
  
  if (isStadiumData) {
    event.respondWith(
      caches.open(STADIUM_DATA_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            // Update cache with fresh data
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
          
          // Return cached response immediately, update cache in background
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
  
  // Handle navigation requests with offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/mlb-sun-tracker/index.html');
      })
    );
  }
});

// Background sync for user preferences
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-preferences') {
    event.waitUntil(syncUserPreferences());
  }
});

async function syncUserPreferences() {
  try {
    // Get stored preferences from IndexedDB or cache
    const cache = await caches.open('mlb-preferences-v1');
    const storedPrefs = await cache.match('/preferences');
    
    if (storedPrefs) {
      const preferences = await storedPrefs.json();
      
      // Sync with server
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      
      if (response.ok) {
        // Clear cached preferences after successful sync
        await cache.delete('/preferences');
        
        // Notify all clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            data: 'Preferences synced successfully'
          });
        });
      }
    }
  } catch (error) {
    console.error('[SW Extensions] Sync failed:', error);
  }
}

// Periodic sync for weather data
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-weather-cache') {
    event.waitUntil(updateWeatherData());
  }
});

async function updateWeatherData() {
  try {
    const cache = await caches.open('weather-api-cache');
    const keys = await cache.keys();
    
    // Update weather data for cached locations
    for (const request of keys) {
      if (request.url.includes('api.open-meteo.com')) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(request, response);
          }
        } catch (error) {
          console.error('[SW Extensions] Failed to update weather:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW Extensions] Weather update failed:', error);
  }
}

// Message handling for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_STADIUM') {
    const { stadiumId } = event.data;
    cacheStadiumData(stadiumId).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

async function cacheStadiumData(stadiumId) {
  const cache = await caches.open(STADIUM_DATA_CACHE);
  const urls = [
    `/api/stadium/${stadiumId}`,
    `/api/stadium/${stadiumId}/sections`,
    `/api/stadium/${stadiumId}/geometry`
  ];
  
  const promises = urls.map(url => 
    fetch(url)
      .then(response => {
        if (response.ok) {
          return cache.put(url, response);
        }
      })
      .catch(error => console.error(`Failed to cache ${url}:`, error))
  );
  
  await Promise.all(promises);
}

console.log('[SW Extensions] Service worker extensions loaded');