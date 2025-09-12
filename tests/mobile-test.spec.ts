import { test, expect } from '@playwright/test';

test.describe('Mobile Functionality Tests', () => {
  test('mobile map zoom controls work correctly', async ({ page }) => {
    // Test on iPhone 12 viewport
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');
    
    // Check if zoom controls are visible
    const zoomControls = await page.locator('.zoom-controls').first();
    if (await zoomControls.isVisible()) {
      // Test zoom in button
      const zoomInBtn = await page.locator('.zoom-btn[aria-label="Zoom in"]').first();
      expect(await zoomInBtn.isVisible()).toBeTruthy();
      
      // Check button size is at least 44x44px
      const zoomInBounds = await zoomInBtn.boundingBox();
      expect(zoomInBounds?.width).toBeGreaterThanOrEqual(44);
      expect(zoomInBounds?.height).toBeGreaterThanOrEqual(44);
      
      // Test zoom out button
      const zoomOutBtn = await page.locator('.zoom-btn[aria-label="Zoom out"]').first();
      expect(await zoomOutBtn.isVisible()).toBeTruthy();
      
      const zoomOutBounds = await zoomOutBtn.boundingBox();
      expect(zoomOutBounds?.width).toBeGreaterThanOrEqual(44);
      expect(zoomOutBounds?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('CTA buttons are visible and properly styled', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/stadiums');
    await page.waitForLoadState('networkidle');
    
    // Check CTA buttons
    const ctaButtons = await page.locator('.cta-btn').all();
    
    for (const btn of ctaButtons.slice(0, 3)) { // Test first 3 buttons
      const isVisible = await btn.isVisible();
      expect(isVisible).toBeTruthy();
      
      // Check minimum height
      const bounds = await btn.boundingBox();
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
      
      // Check background color (should be orange)
      const bgColor = await btn.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).toContain('rgb(255, 136, 0)'); // #ff8800
    }
  });

  test('breadcrumb navigation is functional', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');
    
    // Check breadcrumb exists
    const breadcrumb = await page.locator('.breadcrumb-nav, nav[aria-label="Breadcrumb"]').first();
    if (await breadcrumb.isVisible()) {
      // Check Home link
      const homeLink = await breadcrumb.locator('a[href="/"]').first();
      expect(await homeLink.isVisible()).toBeTruthy();
      expect(await homeLink.textContent()).toContain('Home');
      
      // Check Stadiums link
      const stadiumsLink = await breadcrumb.locator('a[href="/stadiums"]').first();
      if (await stadiumsLink.isVisible()) {
        expect(await stadiumsLink.textContent()).toContain('Stadium');
      }
    }
  });

  test('CSS spacing is consistent on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/stadiums');
    await page.waitForLoadState('networkidle');
    
    // Check section spacing
    const sections = await page.locator('.section').all();
    
    for (const section of sections.slice(0, 2)) {
      const styles = await section.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          marginTop: computed.marginTop,
          marginBottom: computed.marginBottom,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom
        };
      });
      
      // Check that spacing follows the 8px grid system
      const marginTop = parseInt(styles.marginTop);
      const paddingTop = parseInt(styles.paddingTop);
      
      // Should be multiples of 8 or common values
      expect([0, 8, 16, 20, 24, 32, 40].includes(marginTop || 0)).toBeTruthy();
      expect([0, 8, 16, 20, 24, 32, 40].includes(paddingTop || 0)).toBeTruthy();
    }
  });

  test('no console errors on key pages', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const pages = ['/', '/stadiums', '/stadium/yankees', '/seats-shade-finder'];
    
    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
    }
    
    // Ignore known development warnings
    const criticalErrors = errors.filter(err => 
      !err.includes('Warning:') && 
      !err.includes('DevTools') &&
      !err.includes('Source map')
    );
    
    expect(criticalErrors).toEqual([]);
  });

  test('images load correctly without distortion', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      if (await img.isVisible()) {
        // Check image loads
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        
        // Check aspect ratio isn't distorted
        const bounds = await img.boundingBox();
        const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
        
        if (bounds && naturalHeight > 0 && naturalWidth > 0) {
          const displayRatio = bounds.width / bounds.height;
          const naturalRatio = naturalWidth / naturalHeight;
          
          // Allow 10% difference in aspect ratio
          expect(Math.abs(displayRatio - naturalRatio)).toBeLessThan(naturalRatio * 0.1);
        }
      }
    }
  });
});