import { test, expect } from '@playwright/test';

test.describe('Visual Overflow Tests', () => {
  test('no horizontal overflow at mobile viewport', async ({ page }) => {
    const paths = [
      '/',
      '/league/mlb/',
      '/league/nfl/',
      '/league/milb/',
      '/seats-shade-finder/',
      '/stadiums/',
      '/guide/',
      '/faq/',
      '/blog/',
      '/contact/',
      '/privacy/',
      '/terms/',
      '/guide/how-to-find-shaded-seats/',
      '/guide/best-shaded-seats-mlb/',
      '/guide/avoid-sun-baseball-games/',
      '/stadium/yankees/',
      '/stadium/dodgers/'
    ];

    for (const path of paths) {
      await test.step(`Testing ${path}`, async () => {
        await page.goto('https://theshadium.com' + path);
        
        // Test at minimum mobile viewport (360px)
        await page.setViewportSize({ width: 360, height: 800 });
        
        // Check for horizontal overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        expect(hasHorizontalOverflow, `Page ${path} has horizontal overflow at 360px width`).toBeFalsy();
        
        // Also test at common mobile breakpoints
        const breakpoints = [375, 390, 414]; // iPhone sizes
        
        for (const width of breakpoints) {
          await page.setViewportSize({ width, height: 800 });
          const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          expect(overflow, `Page ${path} has horizontal overflow at ${width}px width`).toBeFalsy();
        }
      });
    }
  });

  test('no text overflow in cards and headers', async ({ page }) => {
    await page.goto('https://theshadium.com/stadiums/');
    await page.setViewportSize({ width: 360, height: 800 });
    
    // Check that all text elements are properly contained
    const textOverflow = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, .card, .rounded-xl');
      let hasOverflow = false;
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth) {
          hasOverflow = true;
        }
      });
      
      return hasOverflow;
    });
    
    expect(textOverflow).toBeFalsy();
  });
});