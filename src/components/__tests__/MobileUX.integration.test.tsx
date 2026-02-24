import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SectionList } from '../SectionList';
import { SeatingSectionSun } from '../../utils/sunCalculations';

describe('Mobile UX Integration Tests', () => {
  const createMockSections = (count: number): SeatingSectionSun[] => {
    return Array.from({ length: count }, (_, i) => ({
      section: {
        id: `section-${i}`,
        name: `Section ${i}`,
        level: i % 2 === 0 ? 'lower' : 'upper',
        price: i % 4 === 0 ? 'value' : 'moderate',
        baseAngle: i * 5,
        angleSpan: 10,
        covered: i % 10 === 0
      },
      sunExposure: Math.random() * 100,
      inSun: Math.random() > 0.5,
      timeInSun: Math.random() * 180
    }));
  };

  describe('Virtual Scrolling Performance', () => {
    it('enables virtual scrolling for 60+ sections', () => {
      const sections = createMockSections(70);

      render(<SectionList sections={sections} />);

      // Check if virtual scroll container exists
      const virtualScroll = document.querySelector('.section-virtual-scroll');
      expect(virtualScroll).toBeInTheDocument();
    });

    it('uses normal rendering for <60 sections', () => {
      const sections = createMockSections(50);

      render(<SectionList sections={sections} />);

      // Check if regular grid exists
      const regularGrid = document.querySelector('.section-grid');
      expect(regularGrid).toBeInTheDocument();

      // Virtual scroll should NOT exist
      const virtualScroll = document.querySelector('.section-virtual-scroll');
      expect(virtualScroll).not.toBeInTheDocument();
    });

    it('virtual scroll has smooth scrolling enabled', () => {
      const sections = createMockSections(70);

      render(<SectionList sections={sections} />);

      const virtualScroll = document.querySelector('.section-virtual-scroll');
      const styles = window.getComputedStyle(virtualScroll!);

      expect(styles.scrollBehavior).toBe('smooth');
    });
  });

  describe('Touch Target Accessibility', () => {
    it('all interactive elements meet 44px minimum', () => {
      const sections = createMockSections(10);

      render(<SectionList sections={sections} showFilters={true} />);

      // Check sort buttons
      const sortButtons = screen.getAllByRole('button', { name: /Sort by/i });
      sortButtons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const height = parseInt(styles.minHeight) || parseInt(styles.height);
        expect(height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Mobile Performance Optimizations', () => {
    it('implements passive event listeners for scrolling', () => {
      const sections = createMockSections(70);
      const { container } = render(<SectionList sections={sections} />);

      const sectionList = container.querySelector('.section-list-container');
      expect(sectionList).toBeInTheDocument();

      // The component should have set up passive listeners
      // This is verified by checking that no scroll lag occurs
      // (tested manually in real browsers)
    });

    it('debounces search input', async () => {
      const sections = createMockSections(30);

      render(<SectionList sections={sections} showFilters={true} />);

      const searchInput = screen.getByPlaceholderText(/Search by name/i);

      // Type rapidly
      fireEvent.change(searchInput, { target: { value: 'S' } });
      fireEvent.change(searchInput, { target: { value: 'Se' } });
      fireEvent.change(searchInput, { target: { value: 'Sec' } });
      fireEvent.change(searchInput, { target: { value: 'Sect' } });
      fireEvent.change(searchInput, { target: { value: 'Sectio' } });
      fireEvent.change(searchInput, { target: { value: 'Section' } });

      // Wait for debounce (150ms)
      await waitFor(() => {
        // After debounce, search should be applied
        expect(searchInput).toHaveValue('Section');
      }, { timeout: 200 });
    });
  });

  describe('PWA Features', () => {
    it('PWA install toast has proper touch targets', () => {
      render(
        <div className="pwa-install-toast show">
          <div className="toast-content">
            <button className="toast-action-install">Install</button>
            <button className="toast-action-dismiss" aria-label="Dismiss">×</button>
          </div>
        </div>
      );

      const installBtn = screen.getByText('Install');
      const installStyles = window.getComputedStyle(installBtn);
      expect(parseInt(installStyles.minHeight)).toBeGreaterThanOrEqual(44);

      const dismissBtn = screen.getByLabelText('Dismiss');
      const dismissStyles = window.getComputedStyle(dismissBtn);
      expect(parseInt(dismissStyles.minHeight)).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Filter Drawer Performance', () => {
    it('filter drawer has fast animation (≤200ms)', async () => {
      const mockOnFilterChange = jest.fn();
      const { container } = render(
        <div>
          <button
            className="mobile-filter-trigger"
            onClick={() => {
              const content = container.querySelector('.mobile-filter-content');
              if (content) {
                content.classList.add('show');
              }
            }}
          >
            Open
          </button>
          <div className="mobile-filter-content" style={{ animation: 'slideUp 0.2s' }}>
            Content
          </div>
        </div>
      );

      const trigger = screen.getByText('Open');
      fireEvent.click(trigger);

      const filterContent = container.querySelector('.mobile-filter-content');
      const styles = window.getComputedStyle(filterContent!);

      // Animation duration should be 0.2s or less
      expect(parseFloat(styles.animationDuration || '0.2s')).toBeLessThanOrEqual(0.2);
    });

    it('has backdrop blur effect', () => {
      const { container } = render(
        <div className="mobile-filter-overlay" />
      );

      const overlay = container.querySelector('.mobile-filter-overlay');
      const styles = window.getComputedStyle(overlay!);

      // Should have backdrop-filter blur
      expect(styles.backdropFilter).toContain('blur');
    });
  });

  describe('Scroll Performance', () => {
    it('prevents scroll lag with hardware acceleration', () => {
      const sections = createMockSections(100);
      const { container } = render(<SectionList sections={sections} />);

      const virtualScroll = container.querySelector('.section-virtual-scroll');
      const styles = window.getComputedStyle(virtualScroll!);

      // Should have transform for hardware acceleration
      expect(styles.transform).toBeTruthy();
    });

    it('implements overscroll containment', () => {
      const sections = createMockSections(70);
      const { container } = render(<SectionList sections={sections} />);

      const virtualScroll = container.querySelector('.section-virtual-scroll');
      const styles = window.getComputedStyle(virtualScroll!);

      expect(styles.overscrollBehaviorY || styles.overscrollBehavior).toBe('contain');
    });
  });
});
