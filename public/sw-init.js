// Service Worker Initialization
// This file combines the auto-generated PWA service worker with custom functionality

// First, import the generated service worker
importScripts('./sw.js');

// Then, import our custom service worker extensions
importScripts('./sw-custom.js');

// Log that both service workers are loaded
console.log('[SW Init] MLB Sun Tracker service worker initialized with custom extensions');