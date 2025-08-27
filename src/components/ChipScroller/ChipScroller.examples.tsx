import React, { useState } from 'react';
import ChipScroller, { Chip } from './ChipScroller';
import type { ChipOption } from './ChipScroller';

// Basic chip styles for examples (would normally be in a separate CSS file)
const chipStyles = `
  .chip {
    border: 1px solid var(--ui-border, #e5e7eb);
    border-radius: 999px;
    padding: 8px 16px;
    background: var(--paper, #fff);
    color: var(--ink-800, #1b2432);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  
  .chip:hover:not(:disabled) {
    background: var(--paper-soft, #f8fafc);
    border-color: var(--accent-600, #1d4ed8);
  }
  
  .chip.selected {
    background: var(--accent-600, #1d4ed8);
    color: white;
    border-color: var(--accent-700, #1e40af);
  }
  
  .chip:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .chip-icon {
    margin-right: 6px;
    display: inline-flex;
    align-items: center;
  }
`;

// Example: Stadium Types Filter
export function StadiumTypeFilter() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const stadiumTypes: ChipOption[] = [
    { id: 'all', label: 'All Stadiums' },
    { id: 'open-air', label: 'Open Air', icon: '☀️' },
    { id: 'retractable', label: 'Retractable Roof', icon: '🏟️' },
    { id: 'domed', label: 'Domed', icon: '🏛️' },
    { id: 'classic', label: 'Classic Ballpark', icon: '⚾' },
    { id: 'modern', label: 'Modern', icon: '✨' },
    { id: 'waterfront', label: 'Waterfront', icon: '🌊' },
    { id: 'downtown', label: 'Downtown', icon: '🏙️' },
  ];

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <style>{chipStyles}</style>
      <h2>Stadium Type Filter</h2>
      <p>Selected: {selectedType}</p>
      
      <ChipScroller
        options={stadiumTypes}
        selectedId={selectedType}
        onSelect={setSelectedType}
        chipClassName="chip"
        selectedChipClassName="chip selected"
        ariaLabel="Filter stadiums by type"
      />
    </div>
  );
}

// Example: Multi-select Amenities Filter
export function AmenitiesFilter() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['shade']);

  const amenities: ChipOption[] = [
    { id: 'shade', label: 'Shaded Seats', icon: '🌂' },
    { id: 'covered', label: 'Covered', icon: '🏠' },
    { id: 'premium', label: 'Premium', icon: '💎' },
    { id: 'food', label: 'Food Nearby', icon: '🍕' },
    { id: 'restrooms', label: 'Restrooms', icon: '🚻' },
    { id: 'accessible', label: 'Accessible', icon: '♿' },
    { id: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦' },
    { id: 'bar', label: 'Bar Service', icon: '🍺' },
    { id: 'parking', label: 'Parking', icon: '🚗' },
  ];

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <style>{chipStyles}</style>
      <h2>Amenities Filter (Multi-select)</h2>
      <p>Selected: {selectedAmenities.join(', ') || 'None'}</p>
      
      <ChipScroller
        options={amenities}
        multiple
        selectedIds={selectedAmenities}
        onMultiSelect={setSelectedAmenities}
        chipClassName="chip"
        selectedChipClassName="chip selected"
        ariaLabel="Select amenities"
      />
    </div>
  );
}

// Example: Time of Day Filter with Disabled Options
export function TimeOfDayFilter() {
  const [selectedTime, setSelectedTime] = useState<string>('afternoon');

  const timeOptions: ChipOption[] = [
    { id: 'morning', label: '9 AM - 12 PM', disabled: true },
    { id: 'afternoon', label: '12 PM - 4 PM' },
    { id: 'evening', label: '4 PM - 7 PM' },
    { id: 'night', label: '7 PM+', icon: '🌙' },
  ];

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <style>{chipStyles}</style>
      <h2>Game Time Filter</h2>
      <p>Selected: {selectedTime}</p>
      
      <ChipScroller
        options={timeOptions}
        selectedId={selectedTime}
        onSelect={setSelectedTime}
        chipClassName="chip"
        selectedChipClassName="chip selected"
        disabledChipClassName="chip disabled"
        ariaLabel="Filter by game time"
      />
    </div>
  );
}

// Example: Simple Chip Usage Outside Scroller
export function IndividualChips() {
  const [selected, setSelected] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <style>{chipStyles}</style>
      <h2>Individual Chip Components</h2>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Chip 
          className={`chip ${selected ? 'selected' : ''}`}
          selected={selected}
          onClick={() => setSelected(!selected)}
        >
          Toggle Me
        </Chip>
        
        <Chip className="chip" icon="⭐">
          With Icon
        </Chip>
        
        <Chip className="chip" disabled>
          Disabled
        </Chip>
        
        <Chip className="chip selected">
          Always Selected
        </Chip>
      </div>
    </div>
  );
}

// Example: Responsive Layout Demo
export function ResponsiveDemo() {
  const [selectedSection, setSelectedSection] = useState<string>('field-level');

  const sections: ChipOption[] = [
    { id: 'field-level', label: 'Field Level' },
    { id: 'club-level', label: 'Club Level' },
    { id: 'upper-deck', label: 'Upper Deck' },
    { id: 'bleachers', label: 'Bleachers' },
    { id: 'outfield', label: 'Outfield' },
    { id: 'infield', label: 'Infield' },
    { id: 'behind-plate', label: 'Behind Home Plate' },
    { id: 'first-base', label: '1st Base Side' },
    { id: 'third-base', label: '3rd Base Side' },
    { id: 'standing-room', label: 'Standing Room' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <style>{chipStyles}</style>
      <h2>Section Filter (Responsive)</h2>
      <p>This demonstrates how the ChipScroller handles overflow with many items.</p>
      <p>Selected: {selectedSection}</p>
      
      {/* Full width container */}
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <h3>Full Width</h3>
        <ChipScroller
          options={sections}
          selectedId={selectedSection}
          onSelect={setSelectedSection}
          chipClassName="chip"
          selectedChipClassName="chip selected"
          ariaLabel="Filter by section"
        />
      </div>
      
      {/* Constrained width container */}
      <div style={{ width: '300px', border: '1px dashed #ccc', padding: '10px' }}>
        <h3>Narrow Container (300px)</h3>
        <ChipScroller
          options={sections}
          selectedId={selectedSection}
          onSelect={setSelectedSection}
          chipClassName="chip"
          selectedChipClassName="chip selected"
          ariaLabel="Filter by section"
        />
      </div>
    </div>
  );
}