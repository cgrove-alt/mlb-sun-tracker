import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './MobileStadiumMapWrapper.css';

interface MobileStadiumMapWrapperProps {
  children: ReactNode;
  className?: string;
}

export const MobileStadiumMapWrapper: React.FC<MobileStadiumMapWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Touch gesture state
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [lastTouchPosition, setLastTouchPosition] = useState<{ x: number; y: number } | null>(null);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.25;

  useEffect(() => {
    // Check if tooltip has been shown before
    const tooltipShown = localStorage.getItem('stadiumMapTooltipShown');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!tooltipShown && isMobile) {
      setShowTooltip(true);
      localStorage.setItem('stadiumMapTooltipShown', 'true');
      
      // Auto-hide tooltip after 4 seconds
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start drag
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
      setLastTouchPosition({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2) {
      // Two touches - start pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      // Single touch - drag
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
      setLastTouchPosition({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2 && initialPinchDistance !== null) {
      // Two touches - pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scale = distance / initialPinchDistance;
      const newZoom = Math.min(Math.max(zoom * scale, MIN_ZOOM), MAX_ZOOM);
      setZoom(newZoom);
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialPinchDistance(null);
    setLastTouchPosition(null);
  };

  // Keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className={`stadium-map-container ${className}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={contentRef}
        className="stadium-map-content"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {children}
      </div>

      {/* Zoom Controls */}
      <div className="zoom-controls" role="group" aria-label="Map zoom controls">
        <button
          className="zoom-btn zoom-in"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          title="Zoom in (press +)"
          disabled={zoom >= MAX_ZOOM}
        >
          +
        </button>
        <button
          className="zoom-btn zoom-out"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          title="Zoom out (press -)"
          disabled={zoom <= MIN_ZOOM}
        >
          −
        </button>
        <button
          className="zoom-btn zoom-reset"
          onClick={handleReset}
          aria-label="Reset view"
          title="Reset view (press 0)"
        >
          ⟲
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="zoom-level" aria-live="polite" aria-atomic="true">
        {Math.round(zoom * 100)}%
      </div>

      {/* Mobile Gesture Tooltip */}
      {showTooltip && (
        <div className="mobile-tooltip" role="tooltip">
          <span className="tooltip-icon">👆</span>
          Pinch to zoom • Drag to pan
        </div>
      )}
    </div>
  );
};

export default MobileStadiumMapWrapper;