import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShadeColorScale } from '../ShadeColorScale';
import { SHADE_COLORS } from '../shadeColors';

describe('ShadeColorScale', () => {
  it('renders without crashing', () => {
    render(<ShadeColorScale />);
    expect(screen.getByText('Shade Coverage')).toBeInTheDocument();
  });

  it('renders all color categories', () => {
    render(<ShadeColorScale />);

    SHADE_COLORS.forEach(color => {
      expect(screen.getByText(color.label)).toBeInTheDocument();
    });
  });

  it('displays correct percentage ranges', () => {
    render(<ShadeColorScale />);

    expect(screen.getByText('0% - 20%')).toBeInTheDocument();
    expect(screen.getByText('20% - 40%')).toBeInTheDocument();
    expect(screen.getByText('40% - 60%')).toBeInTheDocument();
    expect(screen.getByText('60% - 80%')).toBeInTheDocument();
    expect(screen.getByText('80% - 100%')).toBeInTheDocument();
  });

  it('has accessible role and label', () => {
    render(<ShadeColorScale />);
    expect(screen.getByRole('img', { name: 'Shade coverage color scale legend' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ShadeColorScale className="custom-legend" />);
    const legendContainer = container.firstChild;
    expect(legendContainer).toHaveClass('custom-legend');
  });

  it('renders color boxes with correct background colors', () => {
    const { container } = render(<ShadeColorScale />);
    const colorBoxes = container.querySelectorAll('[style*="background-color"]');

    expect(colorBoxes.length).toBe(SHADE_COLORS.length);

    colorBoxes.forEach((box, index) => {
      const style = (box as HTMLElement).style.backgroundColor;
      // Convert hex to rgb format that style property uses
      expect(box).toHaveStyle({ backgroundColor: SHADE_COLORS[index].fill });
    });
  });

  it('renders all required elements', () => {
    const { container } = render(<ShadeColorScale />);

    // Check for title
    expect(screen.getByText('Shade Coverage')).toBeInTheDocument();

    // Check for all color items
    const colorItems = container.querySelectorAll('[class*="colorItem"]');
    expect(colorItems.length).toBe(SHADE_COLORS.length);
  });

  it('hides decorative elements from screen readers', () => {
    const { container } = render(<ShadeColorScale />);

    const colorBoxes = container.querySelectorAll('[aria-hidden="true"]');
    expect(colorBoxes.length).toBeGreaterThan(0);
  });
});
