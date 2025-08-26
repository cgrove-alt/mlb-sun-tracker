import { test, expect } from '@playwright/test';

test.describe('Visual Overflow Tests (Local)', () => {
  test('no horizontal overflow at mobile viewport', async ({ page }) => {
    const paths = [
      '/',
      '/league/mlb',
      '/league/nfl',
      '/league/milb',
      '/seats-shade-finder',
      '/stadiums',
      '/guide',
      '/faq',
      '/blog',
      '/contact',
      '/privacy',
      '/terms',
      '/guide/how-to-find-shaded-seats',
      '/guide/best-shaded-seats-mlb',
      '/guide/avoid-sun-baseball-games',
      '/stadium/yankees',
      '/stadium/dodgers'
    ];

    for (const path of paths) {
      await test.step(`Testing ${path}`, async () => {
        await page.goto(path);
        
        // Test at minimum mobile viewport (360px)
        await page.setViewportSize({ width: 360, height: 800 });
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Check for horizontal overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        if (hasHorizontalOverflow) {
          // Take screenshot for debugging
          await page.screenshot({ 
            path: `test-results/overflow-${path.replace(/\//g, '-')}-360px.png`,
            fullPage: true 
          });
        }
        
        expect(hasHorizontalOverflow, `Page ${path} has horizontal overflow at 360px width`).toBeFalsy();
        
        // Also test at common mobile breakpoints
        const breakpoints = [375, 390, 414]; // iPhone sizes
        
        for (const width of breakpoints) {
          await page.setViewportSize({ width, height: 800 });
          const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          
          if (overflow) {
            await page.screenshot({ 
              path: `test-results/overflow-${path.replace(/\//g, '-')}-${width}px.png`,
              fullPage: true 
            });
          }
          
          expect(overflow, `Page ${path} has horizontal overflow at ${width}px width`).toBeFalsy();
        }
      });
    }
  });

  test('no text overflow in cards and headers', async ({ page }) => {
    await page.goto('/stadiums');
    await page.setViewportSize({ width: 360, height: 800 });
    
    await page.waitForLoadState('networkidle');
    
    // Check that all text elements are properly contained
    const textOverflow = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, .card, .rounded-xl');
      let hasOverflow = false;
      let overflowElements: string[] = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth) {
          hasOverflow = true;
          overflowElements.push(`${el.tagName}.${el.className}: ${rect.width}px > ${window.innerWidth}px`);
        }
      });
      
      return { hasOverflow, overflowElements };
    });
    
    if (textOverflow.hasOverflow) {
      console.log('Elements with overflow:', textOverflow.overflowElements);
      await page.screenshot({ path: 'test-results/text-overflow-stadiums.png', fullPage: true });
    }
    
    expect(textOverflow.hasOverflow).toBeFalsy();
  });
});