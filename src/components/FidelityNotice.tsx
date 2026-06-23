import React from 'react';
import { getStadiumDataFidelity, fidelityNote } from '../data/stadiumDataFidelity';
import { InfoIcon } from './Icons';

interface FidelityNoticeProps {
  /** Canonical MLB stadium id. Pass null/undefined to render nothing. */
  stadiumId: string | null | undefined;
}

/**
 * Subtle, honest disclosure for stadiums whose per-section seating data is
 * approximate (the auto-generated bowl template) rather than a real seating
 * map. Renders nothing for parks with real data. Single source of truth:
 * src/data/stadiumDataFidelity.ts.
 *
 * NOTE: the fidelity classifier is MLB-specific, so only render this in MLB
 * contexts (gate non-MLB callers, e.g. by venue.league === 'MLB').
 */
export const FidelityNotice: React.FC<FidelityNoticeProps> = ({ stadiumId }) => {
  if (!stadiumId) return null;
  const note = fidelityNote(getStadiumDataFidelity(stadiumId));
  if (!note) return null;
  return (
    <div
      className="fidelity-notice"
      role="note"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        margin: '12px 0',
        padding: '10px 14px',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        color: '#475569',
        fontSize: '0.85rem',
        lineHeight: 1.4,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: '1px', color: '#0052CC' }} aria-hidden="true">
        <InfoIcon size={16} />
      </span>
      <span>{note}</span>
    </div>
  );
};

export default FidelityNotice;
