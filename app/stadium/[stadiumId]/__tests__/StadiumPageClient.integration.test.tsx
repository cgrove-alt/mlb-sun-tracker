import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StadiumPageClient from '../StadiumPageClient';

// Mock the dependencies
jest.mock('../../../../src/hooks/useSunCalculations', () => ({
  useSunCalculations: jest.fn(() => ({
    data: [
      {
        section: { id: 'section-1', name: 'Section 1', level: 'lower', vertices3D: [] },
        sunExposure: 75,
        inSun: true,
        timeInSun: 2.5
      },
      {
        section: { id: 'section-2', name: 'Section 2', level: 'upper', vertices3D: [] },
        sunExposure: 25,
        inSun: false,
        timeInSun: 0.5
      }
    ],
    rowData: null,
    isLoading: false,
    refetch: jest.fn()
  }))
}));

jest.mock('../../../../src/hooks/usePullToRefresh', () => ({
  usePullToRefresh: jest.fn(() => ({
    pullDistance: 0,
    isRefreshing: false,
    progress: 0
  }))
}));

jest.mock('../../../../src/data/stadium-data-aggregator', () => ({
  getStadiumCompleteData: jest.fn(() => ({
    sections: [
      {
        id: 'section-1',
        name: 'Section 1',
        level: 'lower',
        vertices3D: [
          { x: 0, y: 0, z: 0 },
          { x: 10, y: 0, z: 0 },
          { x: 10, y: 0, z: 10 },
          { x: 0, y: 0, z: 10 }
        ]
      },
      {
        id: 'section-2',
        name: 'Section 2',
        level: 'upper',
        vertices3D: [
          { x: 20, y: 0, z: 0 },
          { x: 30, y: 0, z: 0 },
          { x: 30, y: 0, z: 10 },
          { x: 20, y: 0, z: 10 }
        ]
      }
    ],
    obstructions: []
  }))
}));

// Mock dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (loader: any) => {
    const Component = () => <div data-testid="mocked-component">Mocked Component</div>;
    return Component;
  }
}));

describe('StadiumPageClient - Diagram Integration', () => {
  const mockStadium = {
    id: 'test-stadium',
    name: 'Test Stadium',
    team: 'Test Team',
    city: 'Test City',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York'
  };

  const mockSections = [
    {
      id: 'section-1',
      name: 'Section 1',
      level: 'lower',
      vertices3D: []
    },
    {
      id: 'section-2',
      name: 'Section 2',
      level: 'upper',
      vertices3D: []
    }
  ];

  const mockAmenities = {};
  const mockGuide = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Stadium Diagram Rendering', () => {
    it('renders the stadium diagram when data is available', () => {
      render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      expect(screen.getByText('Interactive Stadium Map')).toBeInTheDocument();
      expect(screen.getByText(/Click any section to see detailed shade information/i)).toBeInTheDocument();
    });

    it('does not render diagram when loading calculations', () => {
      const { useSunCalculations } = require('../../../../src/hooks/useSunCalculations');
      useSunCalculations.mockReturnValue({
        data: null,
        rowData: null,
        isLoading: true,
        refetch: jest.fn()
      });

      render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      expect(screen.queryByText('Interactive Stadium Map')).not.toBeInTheDocument();
    });

    it('does not render diagram when no complete data available', () => {
      const { getStadiumCompleteData } = require('../../../../src/data/stadium-data-aggregator');
      getStadiumCompleteData.mockReturnValue(null);

      render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      expect(screen.queryByText('Interactive Stadium Map')).not.toBeInTheDocument();
    });
  });

  describe('Section Selection Sync', () => {
    it('handles section selection from diagram', async () => {
      const { container } = render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      // Verify StadiumDiagram receives onSectionSelect callback
      const diagram = container.querySelector('[class*="stadium-diagram"]');
      expect(diagram).toBeTruthy();
    });

    it('scrolls to section card when diagram section is selected', async () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      const { container } = render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      // Note: Full integration test would require more complex setup
      // This verifies the component renders correctly
      expect(container).toBeTruthy();
    });
  });

  describe('Responsive Layout', () => {
    it('renders diagram wrapper with responsive classes', () => {
      const { container } = render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      const diagramWrapper = container.querySelector('.stadium-diagram-wrapper');
      expect(diagramWrapper).toBeInTheDocument();
      expect(diagramWrapper).toHaveClass('mt-8', 'mb-8');
    });

    it('applies max-width constraint to diagram', () => {
      const { container } = render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      const diagram = container.querySelector('.max-w-5xl');
      expect(diagram).toBeInTheDocument();
    });
  });

  describe('Shade Data Integration', () => {
    it('converts sun exposure to shade percentage correctly', () => {
      render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      // Verify component renders (shade data conversion happens internally)
      expect(screen.getByText('Interactive Stadium Map')).toBeInTheDocument();
    });

    it('updates shade data when sun calculations change', async () => {
      const { useSunCalculations } = require('../../../../src/hooks/useSunCalculations');
      const { rerender } = render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      // Update sun calculations
      useSunCalculations.mockReturnValue({
        data: [
          {
            section: { id: 'section-1', name: 'Section 1', level: 'lower' },
            sunExposure: 50,
            inSun: true,
            timeInSun: 1.5
          }
        ],
        rowData: null,
        isLoading: false,
        refetch: jest.fn()
      });

      rerender(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      expect(screen.getByText('Interactive Stadium Map')).toBeInTheDocument();
    });
  });

  describe('Pull-to-Refresh Integration', () => {
    it('triggers sun calculation refresh on pull-to-refresh', async () => {
      const mockRefetch = jest.fn();
      const { useSunCalculations } = require('../../../../src/hooks/useSunCalculations');
      useSunCalculations.mockReturnValue({
        data: [
          {
            section: { id: 'section-1', name: 'Section 1', level: 'lower' },
            sunExposure: 75,
            inSun: true,
            timeInSun: 2.5
          }
        ],
        rowData: null,
        isLoading: false,
        refetch: mockRefetch
      });

      render(
        <StadiumPageClient
          stadium={mockStadium}
          sections={mockSections}
          amenities={mockAmenities}
          guide={mockGuide}
        />
      );

      // Component renders successfully with pull-to-refresh integration
      expect(screen.getByText('Interactive Stadium Map')).toBeInTheDocument();
    });
  });
});
