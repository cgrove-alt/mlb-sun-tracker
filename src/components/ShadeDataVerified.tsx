import { SHADE_DATA_VERIFIED_ISO, SHADE_DATA_VERIFIED_LABEL } from '../data/shadeDataVerified';

// "Shade data last verified" line shown on every venue page (audit Phase 5),
// driven by a real dataset field so it stays honest and updates in one place.
export function ShadeDataVerified() {
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
      Shade data last verified:{' '}
      <time dateTime={SHADE_DATA_VERIFIED_ISO}>{SHADE_DATA_VERIFIED_LABEL}</time>
    </p>
  );
}
