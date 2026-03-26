// The Shadium Service Worker - v2
// Runtime caching only — no precache manifest with hardcoded build hashes.
// Previous version (v1) failed with InvalidStateError because it contained a
// Workbox precache manifest with stale chunk hashes from an old deployment.

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `shadium-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `shadium-dynamic-${CACHE_VERSION}`;
const API_CACHE = `shadium-api-${CACHE_VERSION}`;

const KNOWN_CACHES = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];

// Take control of all pages immediately (don't wait for old SW to release)
self.skipWaiting();

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all open clients right away
      self.clients.claim(),
      // Delete every cache that isn't ours (removes stale v1 caches)
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !KNOWN_CACHES.includes(name))
            .map((name) => caches.delete(name))
        )
      ),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Only handle http(s) — skip chrome-extension, data:, etc.
  if (!url.protocol.startsWith('http')) return;

  // ── Weather API — Cache First (30 min TTL) ──────────────────────────────
  if (url.hostname === 'api.open-meteo.com') {
    event.respondWith(cacheFirst(request, API_CACHE, 1800));
    return;
  }

  // ── MLB Stats API — Cache First (1 hr TTL) ──────────────────────────────
  if (url.hostname === 'statsapi.mlb.com') {
    event.respondWith(cacheFirst(request, API_CACHE, 3600));
    return;
  }

  // ── Next.js static assets (content-hashed filenames) — Cache Forever ────
  // These are immutable — the hash changes when content changes.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 365 * 24 * 3600));
    return;
  }

  // ── Images, fonts — Cache Forever ───────────────────────────────────────
  if (/\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 365 * 24 * 3600));
    return;
  }

  // ── HTML page navigations — Network First (fall back to cache) ───────────
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }
});

// ── Cache-First strategy ─────────────────────────────────────────────────────
// Serve from cache if fresh; otherwise fetch, cache, and return.
async function cacheFirst(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const dateHeader = cached.headers.get('date');
    if (dateHeader) {
      const ageSeconds = (Date.now() - new Date(dateHeader).getTime()) / 1000;
      if (ageSeconds < maxAgeSeconds) return cached;
    } else {
      // No date header — treat as fresh
      return cached;
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok || response.type === 'opaque') {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Network failed — return stale cache entry if available
    if (cached) return cached;
    return new Response('Offline — resource unavailable', { status: 503 });
  }
}

// ── Network-First strategy ───────────────────────────────────────────────────
// Try network first; fall back to cache on failure.
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(
      '<!doctype html><html><body><p>You appear to be offline. Please check your connection.</p></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
