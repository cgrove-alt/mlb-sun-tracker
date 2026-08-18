import React from 'react';
import { InfoIcon } from './Icons';

interface FidelityNoticeProps {
  /**
   * Precomputed fidelity note text. Pass null/undefined to render nothing.
   * Compute it with `fidelityNote(getStadiumDataFidelity(id))` from
   * src/data/stadiumDataFidelity.ts — do that on the server (or in an
   * already-deferred client tree) so the fidelity classifier never lands in a
   * page's first-load bundle.
   */
  note: string | null | undefined;
}

/**
 * Honest disclosure of the boundary between source-backed section identities
 * and modeled physical geometry. Purely presentational —
 * the fidelity classification lives in src/data/stadiumDataFidelity.ts and is
 * passed in as `note` by the caller.
 *
 * NOTE: the fidelity classifier is MLB-specific, so callers should only supply
 * a note in MLB contexts (gate non-MLB callers, e.g. by venue.league === 'MLB').
 */
export const FidelityNotice: React.FC<FidelityNoticeProps> = ({ note }) => {
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
