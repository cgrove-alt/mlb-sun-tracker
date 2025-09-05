import React, { useRef, useEffect, forwardRef, memo, useCallback } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { LazySectionCardModern as LazySectionCard } from './LazySectionCardModern';

interface VirtualSectionListProps {
  sections: SeatingSectionSun[];
  height: number;
  itemHeight?: number;
  width?: string | number;
}

interface ItemData {
  sections: SeatingSectionSun[];
}

// Memoized row renderer component for better performance
const Row = memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: ItemData }) => {
  const section = data.sections[index];
  
  // Add padding to the style for better spacing
  const adjustedStyle = {
    ...style,
    paddingRight: '8px',
    paddingLeft: '8px',
    paddingBottom: '8px',
  };
  
  return (
    <div style={adjustedStyle}>
      <LazySectionCard
        section={section.section}
        sunExposure={section.sunExposure}
        inSun={section.inSun}
        index={index}
        timeInSun={section.timeInSun}
      />
    </div>
  );
}, areEqual);

Row.displayName = 'VirtualRow';

// Create a wrapper for the list to handle proper styling
const VirtualSectionListInner = forwardRef<HTMLDivElement, any>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      className="virtual-section-list"
      {...props}
    >
      {children}
    </div>
  )
);

VirtualSectionListInner.displayName = 'VirtualSectionListInner';

export const VirtualSectionList: React.FC<VirtualSectionListProps> = memo(({
  sections,
  height,
  itemHeight = 260, // Adjusted for better spacing
  width = '100%'
}) => {
  const listRef = useRef<List>(null);
  
  // Optimized scroll reset
  const scrollToTop = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(0, 'start');
    }
  }, []);
  
  // Only scroll to top when sections array reference changes significantly
  useEffect(() => {
    // Only reset if the number of sections changes dramatically (e.g., after filtering)
    scrollToTop();
  }, [sections.length > 0 ? Math.floor(sections.length / 10) : 0, scrollToTop]);
  
  // Calculate dynamic item size based on viewport
  const getItemSize = useCallback(() => {
    // Adjust item height based on screen width for responsive design
    if (window.innerWidth < 768) {
      return 280; // Slightly larger on mobile for better touch targets
    }
    return itemHeight;
  }, [itemHeight]);
  
  return (
    <List
      ref={listRef}
      height={height}
      itemCount={sections.length}
      itemSize={getItemSize()}
      width={width}
      itemData={{ sections }}
      outerElementType={VirtualSectionListInner}
      className="section-grid-virtual"
      overscanCount={3} // Render 3 items outside of the visible area for smoother scrolling
    >
      {Row}
    </List>
  );
});

VirtualSectionList.displayName = 'VirtualSectionList';