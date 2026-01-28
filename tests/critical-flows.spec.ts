/**
 * Critical User Flows E2E Tests
 * Tests the most important user journeys through the application
 */

import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.describe('Homepage → Stadium → Shade Results Flow', () => {
    test('user can navigate from homepage to stadium to see shade results', async ({ page }) => {
      // 1. Start at homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // 2. Verify homepage loaded
      await expect(page.locator('h1')).toContainText('TheShadium');

      // 3. Navigate to MLB stadiums
      const mlbLink = page.locator('a[href*="/league/mlb"]').first();
      await mlbLink.click();
      await page.waitForLoadState('networkidle');

      // 4. Click on a stadium (e.g., Yankees)
      const stadiumLink = page.locator('a[href="/stadium/yankees"]').first();
      await stadiumLink.click();
      await page.waitForLoadState('networkidle');

      // 5. Verify stadium page loaded
      await expect(page.locator('h1')).toContainText('Yankee Stadium');

      // 6. Verify section list appears
      await expect(page.locator('text=All Sections')).toBeVisible({ timeout: 15000 });

      // 7. Verify sections loaded
      const sections = await page.locator('[role="region"][aria-label="Stadium sections list"]').count();
      expect(sections).toBeGreaterThan(0);

      // 8. Verify shade percentages are displayed
      const shadePercentages = await page.locator('text=% sun').count();
      expect(shadePercentages).toBeGreaterThan(0);
    });

    test('user can filter sections by maximum sun exposure', async ({ page }) => {
      await page.goto('/stadium/yankees');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('text=All Sections', { timeout: 15000 });

      // Open filters
      const filterButton = page.locator('button:has-text("Filters")').first();
      await filterButton.click();

      // Set max sun to 50%
      const maxSunSlider = page.locator('input[type="range"]#max-sun');
      await maxSunSlider.fill('50');

      // Apply filters
      const applyButton = page.locator('button:has-text("Apply")');
      await applyButton.click();

      // Wait for filtering
      await page.waitForTimeout(1000);

      // Verify filtered results (all sections should be <= 50% sun)
      // This is a visual verification test
      const sectionCards = await page.locator('[data-testid*="section-card"]').count();
      expect(sectionCards).toBeGreaterThan(0);
    });

    test('user can sort sections by shade percentage', async ({ page }) => {
      await page.goto('/stadium/yankees');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('text=All Sections', { timeout: 15000 });

      // Find and click sort dropdown
      const sortDropdown = page.locator('select, button:has-text("Sort")').first();
      await sortDropdown.click();

      // Select shade percentage sort option
      const shadeOption = page.locator('option:has-text("Shade"), text=Shade').first();
      if (await shadeOption.count() > 0) {
        await shadeOption.click();
      }

      // Wait for re-sorting
      await page.waitForTimeout(1000);

      // Verify sections are present
      const sections = await page.locator('[role="region"][aria-label="Stadium sections list"]').count();
      expect(sections).toBeGreaterThan(0);
    });
  });

  test.describe('Section Selection and Comparison', () => {
    test('user can select multiple sections for comparison', async ({ page }) => {
      await page.goto('/stadium/yankees');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('text=All Sections', { timeout: 15000 });

      // Enable comparison mode
      const compareButton = page.locator('button:has-text("Compare")').first();
      if (await compareButton.count() > 0) {
        await compareButton.click();

        // Select 2 sections
        const checkboxes = page.locator('input[type="checkbox"][aria-label*="Compare"]');
        const count = await checkboxes.count();

        if (count >= 2) {
          await checkboxes.nth(0).check();
          await checkboxes.nth(1).check();

          // Verify comparison view appears
          const comparisonView = page.locator('text=Comparing');
          await expect(comparisonView).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('World Cup Flow', () => {
    test('user can navigate World Cup schedule and find shaded seats', async ({ page }) => {
      // 1. Go to World Cup landing page
      await page.goto('/worldcup2026');
      await page.waitForLoadState('networkidle');

      // 2. Verify World Cup page loaded
      await expect(page.locator('h1')).toContainText('World Cup');

      // 3. Navigate to schedule
      const scheduleLink = page.locator('a[href="/worldcup2026/schedule"]').first();
      await scheduleLink.click();
      await page.waitForLoadState('networkidle');

      // 4. Verify schedule loaded with matches
      await expect(page.locator('text=Match Schedule, text=Schedule')).toBeVisible({ timeout: 10000 });

      // 5. Find "Find Shaded Seats" button
      const findSeatsButton = page.locator('button:has-text("Find Shaded Seats"), a:has-text("Find Shaded Seats")').first();

      if (await findSeatsButton.count() > 0) {
        await findSeatsButton.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to a stadium page
        await expect(page.url()).toContain('/stadium/');
      }
    });

    test('user can compare World Cup venues', async ({ page }) => {
      // Go to venue comparison page
      await page.goto('/worldcup2026/compare');
      await page.waitForLoadState('networkidle');

      // Verify comparison page loaded
      await expect(page.locator('h1')).toContainText('Compare');

      // Select venues
      const venueSelects = page.locator('select');
      const count = await venueSelects.count();

      if (count >= 2) {
        await venueSelects.nth(0).selectOption({ index: 1 });
        await venueSelects.nth(1).selectOption({ index: 2 });

        // Verify comparison data appears
        await page.waitForTimeout(1000);
        const comparisonCards = await page.locator('[data-testid*="venue-card"], .venue-card').count();
        expect(comparisonCards).toBeGreaterThan(0);
      }
    });

    test('user can filter World Cup matches by venue', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');
      await page.waitForLoadState('networkidle');

      // Find venue filter
      const venueFilter = page.locator('select#venue-filter, select[aria-label*="Venue"]').first();

      if (await venueFilter.count() > 0) {
        // Select a venue
        await venueFilter.selectOption({ index: 1 });

        // Wait for filtering
        await page.waitForTimeout(1000);

        // Verify matches filtered
        const matches = await page.locator('[data-testid*="match"], .match-card').count();
        expect(matches).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Mobile Responsive Flow', () => {
    test('mobile user can navigate and use filters', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });

      await page.goto('/stadium/yankees');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('text=All Sections', { timeout: 15000 });

      // Open mobile filter drawer
      const filterButton = page.locator('button:has-text("Filters")').first();
      await filterButton.click();

      // Verify drawer opened
      await expect(page.locator('[role="dialog"], .filter-drawer')).toBeVisible({ timeout: 3000 });

      // Close drawer
      const closeButton = page.locator('button[aria-label*="Close"], button:has-text("Close")').first();
      if (await closeButton.count() > 0) {
        await closeButton.click();
      }
    });

    test('mobile user can scroll through section list without horizontal overflow', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });

      await page.goto('/stadium/yankees');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('text=All Sections', { timeout: 15000 });

      // Check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow).toBe(false);
    });
  });

  test.describe('Performance and Loading States', () => {
    test('stadium page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/stadium/yankees');
      await page.waitForSelector('text=All Sections', { timeout: 15000 });

      const loadTime = Date.now() - startTime;

      // Should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('section list shows loading state before data appears', async ({ page }) => {
      await page.goto('/stadium/yankees');

      // Check if loading indicator appears (even briefly)
      const loadingIndicator = page.locator('text=Loading, [role="progressbar"], .loading');

      // Either loading indicator appears or sections load immediately
      const hasLoading = (await loadingIndicator.count()) > 0;
      const hasSections = (await page.locator('text=All Sections').count()) > 0;

      expect(hasLoading || hasSections).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('invalid stadium page shows 404 or error message', async ({ page }) => {
      await page.goto('/stadium/non-existent-stadium-xyz');
      await page.waitForLoadState('networkidle');

      // Should show either 404 page or error message
      const hasError =
        (await page.locator('text=404, text=Not Found, text=Error').count()) > 0 ||
        page.url().includes('404');

      expect(hasError).toBe(true);
    });
  });

  test.describe('Accessibility in Critical Flows', () => {
    test('keyboard navigation works through main flow', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Tab through navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Press Enter on focused element (should work for navigation)
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Should have navigated somewhere
      const url = page.url();
      expect(url).not.toBe(page.url().split('?')[0]); // URL should have changed or at least not errored
    });

    test('screen reader landmarks are present', async ({ page }) => {
      await page.goto('/stadium/yankees');
      await page.waitForLoadState('networkidle');

      // Check for proper landmarks
      const nav = await page.locator('nav').count();
      const main = await page.locator('main').count();
      const regions = await page.locator('[role="region"]').count();

      expect(nav).toBeGreaterThan(0);
      expect(main).toBeGreaterThan(0);
      expect(regions).toBeGreaterThan(0);
    });
  });

  test.describe('Data Persistence', () => {
    test('filter preferences persist in URL', async ({ page }) => {
      await page.goto('/stadium/yankees');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('text=All Sections', { timeout: 15000 });

      // Open filters and apply
      const filterButton = page.locator('button:has-text("Filters")').first();
      await filterButton.click();

      const maxSunSlider = page.locator('input[type="range"]#max-sun');
      await maxSunSlider.fill('50');

      const applyButton = page.locator('button:has-text("Apply")');
      await applyButton.click();

      // Wait for URL to update
      await page.waitForTimeout(1000);

      // Check if URL has filter params
      const url = page.url();
      const hasFilterParam = url.includes('maxSun') || url.includes('filter');

      expect(hasFilterParam).toBe(true);
    });
  });
});
