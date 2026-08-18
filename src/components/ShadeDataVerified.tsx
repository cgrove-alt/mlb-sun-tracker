import { SHADE_DATA_VERIFIED_ISO, SHADE_DATA_VERIFIED_LABEL } from '../data/shadeDataVerified';

// Source-review date. This deliberately does not call the shade geometry
// "verified": reviewing a seating chart validates inventory provenance, not
// row/overhang/obstruction measurements.
export function ShadeDataVerified({ verifiedOn }: { verifiedOn?: string }) {
  const verifiedIso = verifiedOn ?? SHADE_DATA_VERIFIED_ISO;
  const verifiedLabel = verifiedOn
    ? new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeZone: 'UTC',
      }).format(new Date(`${verifiedOn}T00:00:00Z`))
    : SHADE_DATA_VERIFIED_LABEL;

  return (
    <p
      className="shade-data-verified"
      style={{
        margin: '1.5rem auto 0',
        maxWidth: '1200px',
        padding: '0.75rem 1rem',
        fontSize: '0.8125rem',
        color: '#6b7280',
        textAlign: 'center',
      }}
    >
      {verifiedOn ? 'Section source last reviewed:' : 'Venue dataset last reviewed:'}{' '}
      <time dateTime={verifiedIso}>{verifiedLabel}</time>
    </p>
  );
}
