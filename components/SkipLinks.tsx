import './SkipLinks.css';

/**
 * A plain fragment link: the browser scrolls to <main id="main-content"
 * tabIndex={-1}> and moves focus there, with or without JavaScript. The
 * navigation sits right after this link, so it needs no skip link of its own.
 */
export default function SkipLinks() {
  return (
    <nav className="skip-links" aria-label="Skip links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
    </nav>
  );
}
