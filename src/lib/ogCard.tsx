import React from 'react';

// Shared branded Open Graph card (audit Phase 8 follow-up), used by the
// homepage/league/blog opengraph-image routes so they match the per-venue
// images. Only satori-safe inline styles are used (every multi-child div sets
// display:flex; multi-part text is pre-joined into single strings).
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function ogCard({
  eyebrow,
  title,
  subtitle,
  titleFontSize = 72,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  titleFontSize?: number;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0b2545 0%, #13315c 60%, #1b4a7a 100%)',
        color: '#ffffff',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, letterSpacing: 2, color: '#bcd4f0', fontWeight: 700 }}>
        <span style={{ fontSize: 40, marginRight: 14 }}>☀️</span>
        {eyebrow}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: titleFontSize, fontWeight: 800, lineHeight: 1.08 }}>{title}</div>
        {subtitle ? <div style={{ display: 'flex', fontSize: 36, color: '#9fc0e8', marginTop: 16 }}>{subtitle}</div> : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', width: 220, height: 26, borderRadius: 13, overflow: 'hidden' }}>
          <div style={{ display: 'flex', width: 110, height: 26, background: '#1e3a5f' }} />
          <div style={{ display: 'flex', width: 110, height: 26, background: '#f6c453' }} />
        </div>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, marginLeft: 24, color: '#cfe0f5' }}>theshadium.com</div>
      </div>
    </div>
  );
}
