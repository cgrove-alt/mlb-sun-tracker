import React, { useRef, useEffect, forwardRef, memo, useCallback } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { LazySectionCardModern as LazySectionCard } from './LazySectionCardModern';

interface VirtualSectionListProps {
  sections: SeatingSectionSun[];
  height: number;
  itemHeight?: number;
  width?: string | number;
  defaultExpanded?: boolean;
}

interface ItemData {
  sections: SeatingSectionSun[];
  defaultExpanded?: boolean;
}

// Memoized row renderer component for better performance
const Row = memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: ItemData }) => {
  const section = data.sections[index];

  // Add padding to the style for better spacing
  const adjustedStyle = {
    ...style,
    paddingRight: '8px',
    paddingLeft: '8px',
    paddingBottom: '24px', // Increased from 8px to match grid gap
  };

  return (
    <div style={adjustedStyle}>
      <LazySectionCard
        section={section.section}
        sunExposure={section.sunExposure}
        inSun={section.inSun}
        index={index}
        timeInSun={section.timeInSun}
        defaultExpanded={data.defaultExpanded}
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
  itemHeight = 284, // 260px card + 24px bottom padding
  width = '100%',
  defaultExpanded = false
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

  // Calculate dynamic item size based on viewport and expanded state
  const getItemSize = useCallback(() => {
    // Adjust item height based on screen width for responsive design
    if (window.innerWidth < 768) {
      return defaultExpanded ? 304 : 204; // Card height + 24px padding (280+24, 180+24)
    }
    return defaultExpanded ? itemHeight : 204; // Collapsed: 180px card + 24px padding
  }, [itemHeight, defaultExpanded]);

  return (
    <List
      ref={listRef}
      height={height}
      itemCount={sections.length}
      itemSize={getItemSize()}
      width={width}
      itemData={{ sections, defaultExpanded }}
      outerElementType={VirtualSectionListInner}
      className="section-grid-virtual"
      overscanCount={3} // Render 3 items outside of the visible area for smoother scrolling
    >
      {Row}
    </List>
  );
});

VirtualSectionList.displayName = 'VirtualSectionList';