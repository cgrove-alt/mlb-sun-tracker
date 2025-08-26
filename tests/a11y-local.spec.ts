import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests (Local)', () => {
  test('homepage passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations on homepage:');
      accessibilityScanResults.violations.forEach(violation => {
        console.log(`\n${violation.id}: ${violation.description}`);
        console.log(`Impact: ${violation.impact}`);
        console.log(`Help: ${violation.help}`);
        violation.nodes.forEach(node => {
          console.log(`  - ${node.target}`);
        });
      });
    }
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('color contrast on key pages', async ({ page }) => {
    const criticalPaths = [
      '/',
      '/stadiums',
      '/league/mlb',
      '/seats-shade-finder',
      '/guide',
      '/faq'
    ];

    for (const path of criticalPaths) {
      await test.step(`Testing contrast on ${path}`, async () => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        const results = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze();
        
        if (results.violations.length > 0) {
          console.log(`\nColor contrast violations on ${path}:`);
          results.violations.forEach(violation => {
            violation.nodes.forEach(node => {
              console.log(`  - Element: ${node.target}`);
              const match = node.failureSummary?.match(/contrast ratio of ([\d.]+)/);
              if (match) {
                console.log(`    Current ratio: ${match[1]} (needs 4.5:1 for normal text, 3:1 for large text)`);
              }
            });
          });
        }
        
        expect(results.violations, `Color contrast violations on ${path}`).toEqual([]);
      });
    }
  });

  test('navigation landmarks exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
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

  test('form labels and ARIA on contact page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page })
      .withRules(['label', 'aria-allowed-attr', 'aria-required-attr', 'aria-valid-attr'])
      .analyze();
    
    if (results.violations.length > 0) {
      console.log('Form accessibility violations:');
      results.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.help}`);
      });
    }
    
    expect(results.violations).toEqual([]);
  });

  test('focus indicators visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through first few interactive elements
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      
      const hasFocusStyles = await page.evaluate(() => {
        const activeElement = document.activeElement;
        if (!activeElement) return false;
        
        const styles = window.getComputedStyle(activeElement);
        // Check if there's any focus indication
        const hasOutline = styles.outline !== 'none' && styles.outlineWidth !== '0px';
        const hasBoxShadow = styles.boxShadow !== 'none';
        const hasBorderChange = styles.borderColor !== 'transparent';
        
        return hasOutline || hasBoxShadow || hasBorderChange;
      });
      
      if (!hasFocusStyles) {
        const element = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? `${el.tagName}.${el.className}` : 'unknown';
        });
        console.log(`No focus indicator on element ${i + 1}: ${element}`);
      }
    }
  });

  test('heading hierarchy', async ({ page }) => {
    await page.goto('/guide');
    await page.waitForLoadState('networkidle');
    
    const headingIssues = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const issues: string[] = [];
      let lastLevel = 0;
      
      headings.forEach((h, i) => {
        const level = parseInt(h.tagName[1]);
        
        // Check for multiple h1s
        if (level === 1 && i > 0 && headings.filter(h => h.tagName === 'H1').length > 1) {
          issues.push('Multiple H1 tags found');
        }
        
        // Check for skipped levels
        if (lastLevel > 0 && level > lastLevel + 1) {
          issues.push(`Heading level skipped: H${lastLevel} → H${level}`);
        }
        
        lastLevel = level;
      });
      
      return issues;
    });
    
    if (headingIssues.length > 0) {
      console.log('Heading hierarchy issues:', headingIssues);
    }
    
    expect(headingIssues).toEqual([]);
  });
});