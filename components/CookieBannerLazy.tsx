'use client';

import dynamic from 'next/dynamic';

// The cookie/consent banner is not needed for first paint. Loading it with
// ssr:false keeps its JS and CSS off the render-blocking initial path so it
// doesn't compete with LCP; it mounts client-side right after hydration.
const CookieBannerModern = dynamic(() => import('./CookieBannerModern'), {
  ssr: false,
});

export default function CookieBannerLazy() {
  return <CookieBannerModern />;
}
