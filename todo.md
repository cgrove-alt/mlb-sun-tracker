# Fix "Find Your Shade" Scroll Navigation

## Tasks
- [x] Replace `<Link>` with `<a>` for shade-finder nav link in StickyTopNav.tsx
- [x] Add explicit body overflow/position reset in onClick before closeMobileMenu()
- [x] Fix scroll-margin-top from 60px to 72px in ShadeFinder.tsx
- [x] Delete .next cache
- [x] TypeScript type check passes
- [x] Production build passes
- [ ] Playwright verification — scroll tests

## Review

### Changes Summary

**Modified files (2):**

1. **StickyTopNav.tsx** — Replaced `<Link href="/#shade-finder">` with native `<a href="/#shade-finder">` so the browser handles hash scrolling natively instead of Next.js client-side routing swallowing it. Also added explicit `document.body.style.overflow = ''`, `position = ''`, and `classList.remove('sticky-nav-menu-open')` in the onClick handler so the body is scrollable before the browser attempts hash navigation (fixes race condition with async useEffect cleanup).

2. **ShadeFinder.tsx** — Changed `scroll-margin-top: 60px` to `72px` (64px nav height + 8px breathing room) so the section heading isn't tucked behind the sticky nav.

### Verification
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — production build succeeds
