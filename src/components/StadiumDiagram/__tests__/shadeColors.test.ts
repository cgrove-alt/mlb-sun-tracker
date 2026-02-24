import { getShadeColor, SHADE_COLORS, getTextColor } from '../shadeColors';

describe('shadeColors', () => {
  describe('SHADE_COLORS', () => {
    it('contains 5 color ranges', () => {
      expect(SHADE_COLORS).toHaveLength(5);
    });

    it('covers the full 0-100% range', () => {
      expect(SHADE_COLORS[0].range.min).toBe(0);
      expect(SHADE_COLORS[SHADE_COLORS.length - 1].range.max).toBe(100);
    });

    it('has contiguous ranges with no gaps', () => {
      for (let i = 0; i < SHADE_COLORS.length - 1; i++) {
        expect(SHADE_COLORS[i].range.max).toBe(SHADE_COLORS[i + 1].range.min);
      }
    });

    it('has unique colors', () => {
      const colors = SHADE_COLORS.map(c => c.fill);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('has descriptive labels', () => {
      SHADE_COLORS.forEach(color => {
        expect(color.label).toBeTruthy();
        expect(typeof color.label).toBe('string');
        expect(color.label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getShadeColor', () => {
    it('returns red for 0-20% shade (full sun)', () => {
      expect(getShadeColor(0).fill).toBe('#dc2626');
      expect(getShadeColor(10).fill).toBe('#dc2626');
      expect(getShadeColor(19).fill).toBe('#dc2626');
    });

    it('returns orange for 20-40% shade (mostly sun)', () => {
      expect(getShadeColor(20).fill).toBe('#f97316');
      expect(getShadeColor(30).fill).toBe('#f97316');
      expect(getShadeColor(39).fill).toBe('#f97316');
    });

    it('returns amber for 40-60% shade (partial shade)', () => {
      expect(getShadeColor(40).fill).toBe('#f59e0b');
      expect(getShadeColor(50).fill).toBe('#f59e0b');
      expect(getShadeColor(59).fill).toBe('#f59e0b');
    });

    it('returns blue for 60-80% shade (mostly shade)', () => {
      expect(getShadeColor(60).fill).toBe('#3b82f6');
      expect(getShadeColor(70).fill).toBe('#3b82f6');
      expect(getShadeColor(79).fill).toBe('#3b82f6');
    });

    it('returns green for 80-100% shade (full shade)', () => {
      expect(getShadeColor(80).fill).toBe('#10b981');
      expect(getShadeColor(90).fill).toBe('#10b981');
      expect(getShadeColor(100).fill).toBe('#10b981');
    });

    it('handles boundary values correctly', () => {
      expect(getShadeColor(0).fill).toBe('#dc2626');
      expect(getShadeColor(20).fill).toBe('#f97316');
      expect(getShadeColor(40).fill).toBe('#f59e0b');
      expect(getShadeColor(60).fill).toBe('#3b82f6');
      expect(getShadeColor(80).fill).toBe('#10b981');
      expect(getShadeColor(100).fill).toBe('#10b981');
    });

    it('clamps values below 0 to 0', () => {
      const result = getShadeColor(-10);
      expect(result.fill).toBe('#dc2626'); // Same as 0%
    });

    it('clamps values above 100 to 100', () => {
      const result = getShadeColor(150);
      expect(result.fill).toBe('#10b981'); // Same as 100%
    });

    it('handles decimal percentages', () => {
      expect(getShadeColor(15.5).fill).toBe('#dc2626');
      expect(getShadeColor(45.8).fill).toBe('#f59e0b');
      expect(getShadeColor(99.9).fill).toBe('#10b981');
    });

    it('returns color object with all required properties', () => {
      const color = getShadeColor(50);
      expect(color).toHaveProperty('fill');
      expect(color).toHaveProperty('label');
      expect(color).toHaveProperty('range');
      expect(color.range).toHaveProperty('min');
      expect(color.range).toHaveProperty('max');
    });
  });

  describe('getTextColor', () => {
    it('returns white text for dark backgrounds', () => {
      expect(getTextColor('#dc2626')).toBe('#ffffff');
      expect(getTextColor('#f97316')).toBe('#ffffff');
      expect(getTextColor('#3b82f6')).toBe('#ffffff');
      expect(getTextColor('#10b981')).toBe('#ffffff');
    });

    it('returns dark text for light backgrounds', () => {
      expect(getTextColor('#f59e0b')).toBe('#1F2937');
    });

    it('handles unknown colors by defaulting to dark text', () => {
      expect(getTextColor('#ffffff')).toBe('#1F2937');
      expect(getTextColor('#000000')).toBe('#1F2937');
    });
  });
});
