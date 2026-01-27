import React, { useRef, useState, useEffect } from 'react';
import { SeatingSectionSun } from '../../utils/sunCalculations';
import { ComparisonCard } from './ComparisonCard';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import './SectionComparison.css';

interface SectionComparisonProps {
  selectedSections: SeatingSectionSun[];
  onClose: () => void;
  onRemoveSection: (sectionId: string) => void;
}

export const SectionComparison: React.FC<SectionComparisonProps> = ({
  selectedSections,
  onClose,
  onRemoveSection,
}) => {
  const haptic = useHapticFeedback();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle swipe on mobile
  const handleSwipe = (direction: 'left' | 'right') => {
    haptic.light();
    if (direction === 'left' && currentIndex < selectedSections.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Touch handling for swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleSwipe('left');
    } else if (touchEndX.current - touchStartX.current > 50) {
      handleSwipe('right');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && isMobile) {
      handleSwipe('right');
    } else if (e.key === 'ArrowRight' && isMobile) {
      handleSwipe('left');
    }
  };

  const handleRemove = (sectionId: string) => {
    haptic.light();
    onRemoveSection(sectionId);
    // Adjust current index if needed on mobile
    if (isMobile && currentIndex >= selectedSections.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const findBestValue = () => {
    // Calculate best value: lowest sun exposure + best price
    const priceScores = { value: 4, moderate: 3, premium: 2, luxury: 1 };
    return selectedSections.reduce((best, section) => {
      const currentScore = (100 - section.sunExposure) + (priceScores[section.section.price || 'moderate'] * 10);
      const bestScore = (100 - best.sunExposure) + (priceScores[best.section.price || 'moderate'] * 10);
      return currentScore > bestScore ? section : best;
    });
  };

  const findBestShade = () => {
    return selectedSections.reduce((best, section) =>
      section.sunExposure < best.sunExposure ? section : best
    );
  };

  const findBestPrice = () => {
    const priceOrder = { value: 1, moderate: 2, premium: 3, luxury: 4 };
    return selectedSections.reduce((best, section) => {
      const currentPrice = priceOrder[section.section.price || 'moderate'];
      const bestPrice = priceOrder[best.section.price || 'moderate'];
      return currentPrice < bestPrice ? section : best;
    });
  };

  const bestValue = findBestValue();
  const bestShade = findBestShade();
  const bestPrice = findBestPrice();

  if (selectedSections.length === 0) {
    return null;
  }

  return (
    <div
      className="section-comparison-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="section-comparison-container">
        {/* Header */}
        <div className="comparison-header">
          <h2 id="comparison-title" className="comparison-title">
            Compare Sections ({selectedSections.length})
          </h2>
          <button
            onClick={() => {
              haptic.light();
              onClose();
            }}
            className="comparison-close-btn"
            aria-label="Close comparison"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Desktop: Side-by-side view */}
        {!isMobile && (
          <div className="comparison-grid" ref={scrollContainerRef}>
            {selectedSections.map((section) => (
              <ComparisonCard
                key={section.section.id}
                section={section}
                onRemove={handleRemove}
                isBestValue={section.section.id === bestValue.section.id}
                isBestShade={section.section.id === bestShade.section.id}
                isBestPrice={section.section.id === bestPrice.section.id}
              />
            ))}
          </div>
        )}

        {/* Mobile: Swipeable cards */}
        {isMobile && (
          <div
            className="comparison-mobile-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="comparison-mobile-slider">
              <ComparisonCard
                section={selectedSections[currentIndex]}
                onRemove={handleRemove}
                isBestValue={selectedSections[currentIndex].section.id === bestValue.section.id}
                isBestShade={selectedSections[currentIndex].section.id === bestShade.section.id}
                isBestPrice={selectedSections[currentIndex].section.id === bestPrice.section.id}
              />
            </div>

            {/* Navigation arrows */}
            <div className="comparison-mobile-nav">
              <button
                onClick={() => handleSwipe('right')}
                disabled={currentIndex === 0}
                className="comparison-nav-btn"
                aria-label="Previous section"
              >
                <ChevronLeftIcon size={24} />
              </button>

              {/* Dots indicator */}
              <div className="comparison-dots">
                {selectedSections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      haptic.light();
                      setCurrentIndex(index);
                    }}
                    className={`comparison-dot ${index === currentIndex ? 'active' : ''}`}
                    aria-label={`Go to section ${index + 1}`}
                    aria-current={index === currentIndex}
                  />
                ))}
              </div>

              <button
                onClick={() => handleSwipe('left')}
                disabled={currentIndex === selectedSections.length - 1}
                className="comparison-nav-btn"
                aria-label="Next section"
              >
                <ChevronRightIcon size={24} />
              </button>
            </div>

            {/* Current position indicator */}
            <div className="comparison-position-text">
              Section {currentIndex + 1} of {selectedSections.length}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="comparison-tips">
          <p className="text-sm text-gray-600">
            {isMobile ? (
              <>
                <strong>Tip:</strong> Swipe left/right to compare sections. Tap badges to see what makes each section stand out.
              </>
            ) : (
              <>
                <strong>Tip:</strong> Sections with badges indicate the best value in each category. Compare shade coverage, pricing, and amenities side-by-side.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
