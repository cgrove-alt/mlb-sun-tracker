import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StadiumDiagram, SectionShadeData } from '../StadiumDiagram';
import { DetailedSection, Vector3D } from '../../../types/stadium-complete';

// Mock data for testing
const mockSections: DetailedSection[] = [
  {
    id: 'section-1',
    name: 'Section 101',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { x: 10, y: 0, z: 10 },
      { x: 0, y: 0, z: 10 },
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 10,
    rake: 20,
  },
  {
    id: 'section-2',
    name: 'Section 102',
    level: 'field',
    baseAngle: 30,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 10, y: 0, z: 0 },
      { x: 20, y: 0, z: 0 },
      { x: 20, y: 0, z: 10 },
      { x: 10, y: 0, z: 10 },
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 10,
    rake: 20,
  },
  {
    id: 'section-3',
    name: 'Section 201',
    level: 'upper',
    baseAngle: 60,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 20, y: 0, z: 0 },
      { x: 30, y: 0, z: 0 },
      { x: 30, y: 0, z: 10 },
      { x: 20, y: 0, z: 10 },
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 30,
    rake: 25,
  },
];

const mockShadeData: SectionShadeData[] = [
  { sectionId: 'section-1', shadePercentage: 10 },
  { sectionId: 'section-2', shadePercentage: 50 },
  { sectionId: 'section-3', shadePercentage: 90 },
];

describe('StadiumDiagram', () => {
  it('renders without crashing', () => {
    render(<StadiumDiagram sections={mockSections} shadeData={mockShadeData} />);
    expect(screen.getByRole('img', { name: /interactive stadium seating diagram/i })).toBeInTheDocument();
  });

  it('renders all sections', () => {
    render(<StadiumDiagram sections={mockSections} shadeData={mockShadeData} />);
    const sections = screen.getAllByRole('button');
    expect(sections).toHaveLength(mockSections.length);
  });

  it('renders color scale legend', () => {
    render(<StadiumDiagram sections={mockSections} shadeData={mockShadeData} />);
    expect(screen.getByText('Shade Coverage')).toBeInTheDocument();
    expect(screen.getByText('Full Sun')).toBeInTheDocument();
    expect(screen.getByText('Full Shade')).toBeInTheDocument();
  });

  it('calls onSectionSelect when section is clicked', () => {
    const handleSelect = jest.fn();
    render(
      <StadiumDiagram
        sections={mockSections}
        shadeData={mockShadeData}
        onSectionSelect={handleSelect}
      />
    );

    const firstSection = screen.getByRole('button', { name: /Section 101/i });
    fireEvent.click(firstSection);

    expect(handleSelect).toHaveBeenCalledWith('section-1');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('highlights selected section', () => {
    const { container } = render(
      <StadiumDiagram
        sections={mockSections}
        shadeData={mockShadeData}
        selectedSectionId="section-2"
      />
    );

    const selectedSection = screen.getByRole('button', { name: /Section 102/i });
    const polygon = selectedSection.closest('polygon');

    expect(polygon).toHaveAttribute('stroke', '#2563EB');
  });

  it('supports keyboard navigation', () => {
    const handleSelect = jest.fn();
    render(
      <StadiumDiagram
        sections={mockSections}
        shadeData={mockShadeData}
        onSectionSelect={handleSelect}
      />
    );

    const firstSection = screen.getByRole('button', { name: /Section 101/i });

    // Test Enter key
    fireEvent.keyDown(firstSection, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('section-1');

    // Test Space key
    handleSelect.mockClear();
    fireEvent.keyDown(firstSection, { key: ' ' });
    expect(handleSelect).toHaveBeenCalledWith('section-1');
  });

  it('applies correct aria-label to sections', () => {
    render(<StadiumDiagram sections={mockSections} shadeData={mockShadeData} />);

    expect(screen.getByRole('button', { name: /Section 101, 10% shade coverage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Section 102, 50% shade coverage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Section 201, 90% shade coverage/i })).toBeInTheDocument();
  });

  it('handles sections with no shade data', () => {
    const incompleteShadData: SectionShadeData[] = [
      { sectionId: 'section-1', shadePercentage: 10 },
    ];

    render(<StadiumDiagram sections={mockSections} shadeData={incompleteShadData} />);

    // Sections without shade data should default to 0%
    expect(screen.getByRole('button', { name: /Section 102, 0% shade coverage/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StadiumDiagram
        sections={mockSections}
        shadeData={mockShadeData}
        className="custom-class"
      />
    );

    const diagramContainer = container.firstChild;
    expect(diagramContainer).toHaveClass('custom-class');
  });

  it('renders field marker in center', () => {
    const { container } = render(
      <StadiumDiagram sections={mockSections} shadeData={mockShadeData} />
    );

    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('cx', '0');
    expect(circle).toHaveAttribute('cy', '0');
  });

  it('calculates correct viewBox based on section bounds', () => {
    const { container } = render(
      <StadiumDiagram sections={mockSections} shadeData={mockShadeData} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox');

    const viewBox = svg?.getAttribute('viewBox');
    expect(viewBox).toBeTruthy();
  });

  it('handles empty sections array', () => {
    render(<StadiumDiagram sections={[]} shadeData={[]} />);

    expect(screen.getByRole('img', { name: /interactive stadium seating diagram/i })).toBeInTheDocument();
    const sections = screen.queryAllByRole('button');
    expect(sections).toHaveLength(0);
  });

  it('rounds shade percentages for display', () => {
    const fractionalShadeData: SectionShadeData[] = [
      { sectionId: 'section-1', shadePercentage: 15.7 },
    ];

    render(<StadiumDiagram sections={[mockSections[0]]} shadeData={fractionalShadeData} />);

    // Should round to 16%
    expect(screen.getByRole('button', { name: /Section 101, 16% shade coverage/i })).toBeInTheDocument();
  });
});
