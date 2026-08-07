/**
 * Keyboard activation for non-button interactive elements.
 *
 * A `<div onClick={...}>` is invisible to keyboard and switch users: only
 * natively focusable elements fire a click from Enter/Space. Where an element
 * genuinely cannot be a `<button>` (layout/styling constraints), it needs the
 * full set — `role="button"`, `tabIndex={0}` AND a key handler — not just one or
 * two of the three. Several places in this codebase had the role and tabIndex
 * but no handler, which is arguably worse: the element advertises itself as a
 * button, takes focus, and then does nothing when activated.
 *
 * Prefer a real `<button>`. Use this only when you can't.
 */

import type { KeyboardEvent } from 'react';

/**
 * Build an `onKeyDown` that activates on Enter or Space, matching native button
 * behaviour.
 *
 * Space is `preventDefault`ed because its default action on a focused non-input
 * element is to scroll the page — activating a control and jumping the viewport
 * at the same time is disorienting.
 */
export function onActivateKeyDown<T extends Element>(
  handler: (event: KeyboardEvent<T>) => void,
) {
  return (event: KeyboardEvent<T>): void => {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;

    // Let the event through if it originated in a real control nested inside —
    // otherwise activating a link or input within the region double-fires.
    const target = event.target as HTMLElement | null;
    if (target && (target as Element) !== (event.currentTarget as Element)) {
      const tag = target.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
        return;
      }
    }

    if (event.key !== 'Enter') event.preventDefault();
    handler(event);
  };
}

/** Props that together make a non-button element behave like one. */
export function activatableProps<T extends Element>(
  handler: (event: KeyboardEvent<T>) => void,
  options: { label?: string; disabled?: boolean } = {},
) {
  return {
    role: 'button' as const,
    tabIndex: options.disabled ? -1 : 0,
    onKeyDown: onActivateKeyDown<T>(handler),
    ...(options.label ? { 'aria-label': options.label } : {}),
  };
}
