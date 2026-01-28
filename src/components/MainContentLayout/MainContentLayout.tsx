'use client';

import React, { useRef, useEffect } from 'react';
import styles from './MainContentLayout.module.css';

export interface MainContentLayoutProps {
  /** Content for the left panel (diagram) - 40% width */
  diagramContent: React.ReactNode;
  /** Content for the right panel (cards) - 60% width */
  cardsContent: React.ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** ID of section to scroll to in cards panel */
  scrollToSectionId?: string | null;
}

/**
 * MainContentLayout - Side-by-side layout with 40/60 split
 *
 * Left panel (40%): Stadium diagram
 * Right panel (60%): Section cards
 *
 * Responsive: Stacks vertically on tablet/mobile
 */
export const MainContentLayout: React.FC<MainContentLayoutProps> = ({
  diagramContent,
  cardsContent,
  className = '',
  scrollToSectionId,
}) => {
  const cardsPanelRef = useRef<HTMLDivElement>(null);

  // Scroll to highlighted section when it changes
  useEffect(() => {
    if (!scrollToSectionId || !cardsPanelRef.current) return;

    // Find the section card by data attribute
    const sectionCard = cardsPanelRef.current.querySelector(
      `[data-section-id="${scrollToSectionId}"]`
    );

    if (sectionCard) {
      // Smooth scroll the card into view within the cards panel
      sectionCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [scrollToSectionId]);

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Left Panel: Stadium Diagram (40%) */}
      <div className={styles.diagramPanel} role="region" aria-label="Stadium diagram">
        {diagramContent}
      </div>

      {/* Right Panel: Section Cards (60%) */}
      <div
        ref={cardsPanelRef}
        className={styles.cardsPanel}
        role="region"
        aria-label="Section cards"
      >
        {cardsContent}
      </div>
    </div>
  );
};

export default MainContentLayout;
