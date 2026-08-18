import React from 'react';
import {
  getStadiumShadeConfidence,
  UNVALIDATED_SHADE_NOTICE,
} from '../data/stadiumShadeConfidence';

export function ShadeConfidenceNotice({
  stadiumId,
  roof,
}: {
  stadiumId: string;
  roof?: string;
}) {
  const confidence = getStadiumShadeConfidence(stadiumId);
  const fixedRoof = roof === 'fixed';
  const retractableRoof = roof === 'retractable';
  const status = fixedRoof ? 'verified-shaded' : retractableRoof ? 'roof-state-dependent' : 'uncertain';

  return (
    <aside
      role="note"
      aria-label="Shade data confidence"
      style={{
        margin: '1rem auto 1.5rem',
        maxWidth: '1200px',
        padding: '0.9rem 1rem',
        border: `1px solid ${fixedRoof ? '#86efac' : '#f5c96a'}`,
        borderLeft: `4px solid ${fixedRoof ? '#15803d' : '#b45309'}`,
        borderRadius: '0.65rem',
        background: fixedRoof ? '#f0fdf4' : '#fffbeb',
        color: fixedRoof ? '#14532d' : '#78350f',
        lineHeight: 1.5,
      }}
    >
      <strong>{fixedRoof ? 'Fixed-roof result' : retractableRoof ? 'Roof-state-dependent result' : 'Measurement status: remote reconstruction in progress.'}</strong>{' '}
      {fixedRoof
        ? 'The permanent roof blocks direct sunlight throughout the seating bowl. Detailed row geometry is still not used to rank seats.'
        : retractableRoof
          ? `The event's confirmed roof state is required. ${UNVALIDATED_SHADE_NOTICE}`
          : UNVALIDATED_SHADE_NOTICE}
      <details style={{ marginTop: '0.45rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Data details</summary>
        <ul style={{ margin: '0.45rem 0 0 1.2rem', padding: 0 }}>
          <li>Section identity: {confidence.sectionIdentity}</li>
          <li>Published inventory: {confidence.sectionInventory}</li>
          <li>Horizontal placement: {confidence.horizontalPlacement}</li>
          <li>Row geometry: {confidence.rowGeometry}</li>
          <li>Obstructions: {confidence.obstructionGeometry}</li>
          <li>Independent observation validation: {confidence.observationValidation}</li>
          <li>Publication gate: {confidence.publicationBlockers.length === 0 ? 'passed' : `withheld (${confidence.publicationBlockers.length} blockers)`}</li>
          <li>Public shade status: {status}</li>
        </ul>
      </details>
    </aside>
  );
}
