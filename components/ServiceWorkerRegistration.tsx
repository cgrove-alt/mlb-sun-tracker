'use client';

import { useEffect } from 'react';

/**
 * Unregisters all existing service workers and wipes every cache bucket.
 * Called when we detect a stale registration (e.g. the first time v2 runs,
 * or when registration/update throws an error).
 */
async function cleanupStaleServiceWorkers(): Promise<void> {
  // Unregister every existing SW registration
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));

  // Delete all caches (removes old v1 Workbox precache buckets)
  const cacheKeys = await caches.keys();
  await Promise.all(cacheKeys.map((key) => caches.delete(key)));
}

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') {
      return;
    }

    const SW_VERSION_KEY = 'shadium_sw_version';
    const CURRENT_SW_VERSION = 'v2';

    async function registerSW() {
      // If this is the first time a user runs v2, clean up the old v1 Workbox SW
      // (which had a stale precache manifest causing InvalidStateError).
      const storedVersion = localStorage.getItem(SW_VERSION_KEY);
      if (storedVersion !== CURRENT_SW_VERSION) {
        try {
          await cleanupStaleServiceWorkers();
        } catch {
          // Cleanup is best-effort — don't block registration
        }
      }

      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Record that the current version is installed
        localStorage.setItem(SW_VERSION_KEY, CURRENT_SW_VERSION);

        console.log('Service Worker registered with scope:', registration.scope);

        // Periodically check for SW updates (every 60 s)
        const updateInterval = setInterval(() => {
          registration.update().catch(() => {
            // Update checks may fail offline — that's fine
          });
        }, 60_000);

        // Handle the new SW installing
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
              window.dispatchEvent(new Event('sw-update-available'));
            }
          });
        });

        // Clean up interval if the component ever unmounts (SSR safety)
        return () => clearInterval(updateInterval);
      } catch (error) {
        console.error('Service Worker registration failed:', error);

        // If registration failed, clean up any stale registrations so the
        // next page load can attempt a fresh registration.
        try {
          await cleanupStaleServiceWorkers();
          localStorage.removeItem(SW_VERSION_KEY);
        } catch {
          // Ignore cleanup errors
        }
      }
    }

    // Wait for the page to finish loading before registering
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW, { once: true });
    }

    // Handle controller change (SW activated after update)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });
  }, []);

  return null;
}
