'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Single source of truth for the GA4 measurement ID. Vercel sets
// NEXT_PUBLIC_GA_ID in the production environment (see vercel.json); the
// literal is a fallback so the loader keeps working if the env var is unset.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-JXGEKF957C';

// `window.gtag` and `window.dataLayer` are declared globally in
// src/utils/analytics.ts; intentionally not re-declared here to avoid
// TS2717 "subsequent property declarations must have the same type."

/**
 * Loads Google Analytics 4 via next/script so the script tag is emitted into
 * the initial HTML response and loaded by the Next.js runtime, NOT via
 * post-hydration DOM injection.
 *
 * The previous implementation (manual document.createElement inside a
 * requestIdleCallback inside a useEffect) was silently failing in production:
 *
 *   1. It only ran after full client hydration completed. Any unhandled JS
 *      error elsewhere in the tree prevented the effect from firing, and GA
 *      never loaded.
 *   2. It bailed out via `if (window.gtag) return` — any browser extension or
 *      stray script that defined a `gtag` stub before the effect fired would
 *      permanently block GA from initializing.
 *   3. There was no explicit Consent Mode v2 default state. gtag.js then
 *      relied on undocumented region/header heuristics to decide whether to
 *      transmit, which produced "library loads, dataLayer fills, but no
 *      /collect requests fire" failures that were invisible without a
 *      headless-browser probe.
 *
 * The new implementation eliminates all three failure modes:
 *   - next/script with strategy="afterInteractive" puts the script reference
 *     in the initial HTML and loads it as soon as the page is interactive.
 *     No useEffect required.
 *   - Consent Mode v2 defaults are set in an inline script that emits BEFORE
 *     gtag.js processes the queue, so behavior is predictable.
 *   - The cookie banner downgrades analytics_storage to 'denied' via
 *     gtag('consent', 'update', ...) when the user opts out (or when GPC is
 *     active), which is the correct compliance flow.
 */
export default function GoogleAnalyticsLazy() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // GA4 doesn't auto-fire pageviews on App Router client-side navigations.
  // Fire one explicitly whenever the route changes. The initial pageview
  // for the entry URL is sent by the inline init script below.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.origin + url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  // Skip GA entirely in dev so localhost traffic never lands in the property.
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      {/*
        Inline init script runs first and seeds the dataLayer with:
          1. Consent Mode v2 defaults (analytics granted, ads denied — we
             don't run ads)
          2. The library timestamp
          3. The initial config + first pageview
        Because gtag.js is loaded async, its queue processor reads these
        commands in order once it boots.
      */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'functionality_storage': 'granted',
            'security_storage': 'granted',
            'personalization_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: true
          });
        `}
      </Script>
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
