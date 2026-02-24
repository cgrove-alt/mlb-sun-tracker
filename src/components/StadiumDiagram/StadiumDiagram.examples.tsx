import React, { useState } from 'react';
import { StadiumDiagram, SectionShadeData } from './StadiumDiagram';
import { DetailedSection, Vector3D } from '../../types/stadium-complete';

// Example: Simple circular stadium
const createCircularStadium = (): DetailedSection[] => {
  const sections: DetailedSection[] = [];
  const sectionCount = 12;
  const anglePerSection = 360 / sectionCount;

  for (let i = 0; i < sectionCount; i++) {
    const angle = i * anglePerSection;
    const radians = (angle * Math.PI) / 180;
    const nextRadians = ((angle + anglePerSection) * Math.PI) / 180;

    const innerRadius = 50;
    const outerRadius = 80;

    sections.push({
      id: `section-${100 + i}`,
      name: `${100 + i}`,
      level: 'field',
      baseAngle: angle,
      angleSpan: anglePerSection,
      rows: [],
      vertices3D: [
        { x: Math.cos(radians) * innerRadius, y: 0, z: Math.sin(radians) * innerRadius },
        { x: Math.cos(nextRadians) * innerRadius, y: 0, z: Math.sin(nextRadians) * innerRadius },
        { x: Math.cos(nextRadians) * outerRadius, y: 0, z: Math.sin(nextRadians) * outerRadius },
        { x: Math.cos(radians) * outerRadius, y: 0, z: Math.sin(radians) * outerRadius },
      ] as Vector3D[],
      covered: false,
      distance: (innerRadius + outerRadius) / 2,
      height: 10,
      rake: 20,
    });
  }

  return sections;
};

// Example: Generate shade data (simulating afternoon game)
const generateAfternoonShade = (sections: DetailedSection[]): SectionShadeData[] => {
  return sections.map(section => {
    // Sections on west side (180-360°) get more shade in afternoon
    const isWestSide = section.baseAngle >= 180;
    const baseShade = isWestSide ? 70 : 20;
    const randomVariation = Math.random() * 20 - 10;

    return {
      sectionId: section.id,
      shadePercentage: Math.max(0, Math.min(100, baseShade + randomVariation)),
    };
  });
};

// Example 1: Basic Usage
export const BasicExample: React.FC = () => {
  const sections = createCircularStadium();
  const shadeData = generateAfternoonShade(sections);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Basic Stadium Diagram</h2>
      <StadiumDiagram sections={sections} shadeData={shadeData} />
    </div>
  );
};

// Example 2: Interactive with Selection
export const InteractiveExample: React.FC = () => {
  const sections = createCircularStadium();
  const shadeData = generateAfternoonShade(sections);
  const [selectedSection, setSelectedSection] = useState<string | undefined>();

  const selectedSectionData = sections.find(s => s.id === selectedSection);
  const selectedShadeData = shadeData.find(d => d.sectionId === selectedSection);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Interactive Stadium Diagram</h2>
      <p>Click on a section to see details</p>

      <StadiumDiagram
        sections={sections}
        shadeData={shadeData}
        selectedSectionId={selectedSection}
        onSectionSelect={setSelectedSection}
      />

      {selectedSectionData && selectedShadeData && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
          }}
        >
          <h3>Selected: Section {selectedSectionData.name}</h3>
          <p>Shade Coverage: {Math.round(selectedShadeData.shadePercentage)}%</p>
          <p>Level: {selectedSectionData.level}</p>
          <p>Distance from field: {selectedSectionData.distance} ft</p>
        </div>
      )}
    </div>
  );
};

// Example 3: Multiple time comparisons
export const TimeComparisonExample: React.FC = () => {
  const sections = createCircularStadium();

  // Morning game (9 AM) - east side in sun
  const morningShade = sections.map(section => {
    const isEastSide = section.baseAngle >= 0 && section.baseAngle < 180;
    return {
      sectionId: section.id,
      shadePercentage: isEastSide ? 10 : 80,
    };
  });

  // Afternoon game (3 PM) - west side in sun
  const afternoonShade = generateAfternoonShade(sections);

  // Evening game (7 PM) - most sections shaded
  const eveningShade = sections.map(section => ({
    sectionId: section.id,
    shadePercentage: 75 + Math.random() * 20,
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Shade Coverage by Game Time</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <h3>9:00 AM</h3>
          <StadiumDiagram sections={sections} shadeData={morningShade} />
        </div>

        <div>
          <h3>3:00 PM</h3>
          <StadiumDiagram sections={sections} shadeData={afternoonShade} />
        </div>

        <div>
          <h3>7:00 PM</h3>
          <StadiumDiagram sections={sections} shadeData={eveningShade} />
        </div>
      </div>
    </div>
  );
};
