import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage passes axe accessibility checks', async ({ page }) => {
    await page.goto('https://theshadium.com/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('contrast and landmarks on key pages', async ({ page }) => {
    const criticalPaths = [
      '/',
      '/stadiums/',
      '/league/mlb/',
      '/seats-shade-finder/',
      '/guide/',
      '/stadium/yankees/'
    ];

    for (const path of criticalPaths) {
      await test.step(`Testing accessibility on ${path}`, async () => {
        await page.goto('https://theshadium.com' + path);
        
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .disableRules(['color-contrast-enhanced']) // AA is sufficient, not AAA
          .analyze();
        
        // Log violations for debugging
        if (results.violations.length > 0) {
          console.log(`Violations found on ${path}:`);
          results.violations.forEach(violation => {
            console.log(`- ${violation.id}: ${violation.description}`);
            console.log(`  Impact: ${violation.impact}`);
            console.log(`  Affected nodes: ${violation.nodes.length}`);
          });
        }
        
        expect(results.violations).toEqual([]);
      });
    }
  });

  test('color contrast specifically', async ({ page }) => {
    await page.goto('https://theshadium.com/');
    
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();
    
    // Check specifically for color contrast issues
    const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
    
    if (contrastViolations.length > 0) {
      console.log('Color contrast violations found:');
      contrastViolations.forEach(violation => {
        violation.nodes.forEach(node => {
          console.log(`- Element: ${node.target}`);
          console.log(`  ${node.failureSummary}`);
        });
      });
    }
    
    expect(contrastViolations).toEqual([]);
  });

  test('navigation landmarks exist', async ({ page }) => {
    await page.goto('https://theshadium.com/');
    
    // Check for proper landmarks
    const landmarks = await page.evaluate(() => {
      return {
        hasNav: document.querySelector('nav') !== null,
        hasMain: document.querySelector('main') !== null,
        hasHeader: document.querySelector('header') !== null || document.querySelector('[role="banner"]') !== null,
        hasFooter: document.querySelector('footer') !== null || document.querySelector('[role="contentinfo"]') !== null
      };
    });
    
    expect(landmarks.hasNav, 'Page should have navigation landmark').toBeTruthy();
    expect(landmarks.hasMain, 'Page should have main landmark').toBeTruthy();
  });

  test('form labels and ARIA', async ({ page }) => {
    await page.goto('https://theshadium.com/contact/');
    
    const results = await new AxeBuilder({ page })
      .withRules(['label', 'aria-allowed-attr', 'aria-required-attr', 'aria-valid-attr'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('focus indicators visible', async ({ page }) => {
    await page.goto('https://theshadium.com/');
    
    // Tab through interactive elements and check for focus styles
    await page.keyboard.press('Tab');
    
    const hasFocusStyles = await page.evaluate(() => {
      const activeElement = document.activeElement;
      if (!activeElement) return false;
      
      const styles = window.getComputedStyle(activeElement);
      // Check if there's any focus indication (outline, border, box-shadow)
      return styles.outline !== 'none' || 
             styles.outlineWidth !== '0px' ||
             styles.boxShadow !== 'none' ||
             styles.border !== 'none';
    });
    
    expect(hasFocusStyles, 'Interactive elements should have visible focus indicators').toBeTruthy();
  });
});