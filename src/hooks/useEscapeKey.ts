'use client';

/**
 * Close-on-Escape for dialogs, lightboxes and popovers.
 *
 * Several overlays in this codebase could only be dismissed by clicking their
 * backdrop. A backdrop click is a pointer-only affordance, so a keyboard user
 * who opened the overlay had no way to close it — and because the backdrop is
 * (correctly) `aria-hidden`, it isn't reachable by tab either. Escape is the
 * expected key for this and costs one hook.
 */

import { useEffect } from 'react';

export function useEscapeKey(enabled: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!enabled) return;

    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };

    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [enabled, onEscape]);
}
