import React, { useRef, useEffect, forwardRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { LazySectionCard } from './LazySectionCard';

interface VirtualSectionListProps {
  sections: SeatingSectionSun[];
  height: number;
  itemHeight?: number;
  width?: string | number;
}

interface ItemData {
  sections: SeatingSectionSun[];
}

// Row renderer component
const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: ItemData }) => {
  const section = data.sections[index];
  
  return (
    <div style={style}>
      <LazySectionCard
        section={section.section}
        sunExposure={section.sunExposure}
        inSun={section.inSun}
        index={index}
      />
    </div>
  );
};

// Create a wrapper for the list to handle proper styling
const VirtualSectionListInner = ({ width, children, ...props }: any, ref: any) => (
  <div
    ref={ref}
    style={{ width: width || '100%' }}
    className="virtual-section-list"
    {...props}
  >
    {children}
  </div>
);

const CustomScrollbarsVirtualList = forwardRef(VirtualSectionListInner);

export const VirtualSectionList: React.FC<VirtualSectionListProps> = ({
  sections,
  height,
  itemHeight = 240, // Approximate height of a section card
  width = '100%'
}) => {
  const listRef = useRef<List>(null);
  
  // Scroll to top when sections change significantly
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(0, 'start');
    }
  }, [sections.length]);
  
  return (
    <List
      ref={listRef}
      height={height}
      itemCount={sections.length}
      itemSize={itemHeight}
      width={width}
      itemData={{ sections }}
      outerElementType={CustomScrollbarsVirtualList}
      className="section-grid-virtual"
    >
      {Row}
    </List>
  );
};