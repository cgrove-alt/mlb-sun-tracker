import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Row-Level UI Integration Tests', () => {
  test('stadium page loads with section list', async ({ page }) => {
    // Navigate to a stadium page
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Wait for the "All Sections" heading (from SectionList component)
    await page.waitForSelector('text=All Sections', { timeout: 15000 });

    // Verify section list region is present
    const sectionList = await page.locator('[role="region"][aria-label="Stadium sections list"]').count();
    expect(sectionList).toBeGreaterThan(0);
  });

  test('row toggle button is visible when row data loads', async ({ page }) => {
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Wait for All Sections to load
    await page.waitForSelector('text=All Sections', { timeout: 15000 });

    // Row toggle button should be visible (since we enabled includeRows=true)
    const toggleButton = page.locator('button:has-text("Show Row Details")');

    // Give it time to load row data
    await page.waitForTimeout(2000);

    // This should now be visible - if not, the integration is broken
    const toggleCount = await toggleButton.count();

    // This test will fail if row data isn't loading, which is what we want
    expect(toggleCount, 'Row toggle button should be visible when row data loads').toBeGreaterThan(0);
  });

  test('clicking row toggle enables row-level view', async ({ page }) => {
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Wait for section list and row toggle
    await page.waitForSelector('text=All Sections', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const toggleButton = page.locator('button:has-text("Show Row Details")').first();

    // Assert button exists before trying to click
    await expect(toggleButton, 'Row toggle button must exist').toBeVisible({ timeout: 5000 });

    // Click toggle
    await toggleButton.click();

    // Verify toggle state changed
    await expect(page.locator('button:has-text("Viewing Row Details")')).toBeVisible();
  });

  test('section cards show row summary when row data is loaded', async ({ page }) => {
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Wait for sections and enable row view
    await page.waitForSelector('text=All Sections', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const toggleButton = page.locator('button:has-text("Show Row Details")').first();
    await expect(toggleButton).toBeVisible({ timeout: 5000 });
    await toggleButton.click();

    // Now section cards should show "Best shade rows" text
    const rowSummary = await page.locator('text=Best shade rows').count();
    expect(rowSummary, 'Section cards should show row summary').toBeGreaterThan(0);
  });

  test('expanding a section shows row breakdown table', async ({ page }) => {
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Enable row view
    await page.waitForSelector('text=All Sections', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const toggleButton = page.locator('button:has-text("Show Row Details")').first();
    await expect(toggleButton).toBeVisible({ timeout: 5000 });
    await toggleButton.click();

    // Find and click "View Row Details" on a section card
    const viewDetailsButton = page.locator('button:has-text("View Row Details")').first();
    await expect(viewDetailsButton, 'View Row Details button must exist on section card').toBeVisible({ timeout: 5000 });
    await viewDetailsButton.click();

    // Row breakdown should appear with "Row Details" heading
    await expect(page.locator('text=Row Details')).toBeVisible({ timeout: 3000 });

    // Should show the filter dropdown
    const filterSelect = page.locator('select#rec-filter');
    await expect(filterSelect, 'Row filter dropdown should be visible').toBeVisible();
  });

  test('row breakdown table has proper structure', async ({ page }) => {
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Enable row view and expand a section
    await page.waitForSelector('text=All Sections', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const toggleButton = page.locator('button:has-text("Show Row Details")').first();
    await toggleButton.click();

    const viewDetailsButton = page.locator('button:has-text("View Row Details")').first();
    await viewDetailsButton.click();

    // Check for table on desktop (hidden on mobile via CSS)
    const table = page.locator('table');
    const hasTable = await table.count() > 0;

    if (hasTable) {
      // Verify table headers
      await expect(page.locator('th:has-text("Row")')).toBeVisible();
      await expect(page.locator('th:has-text("Seats")')).toBeVisible();
      await expect(page.locator('th:has-text("Shade Coverage")')).toBeVisible();
    }
  });

  test('row filtering works correctly', async ({ page }) => {
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Enable row view and expand
    await page.waitForSelector('text=All Sections', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const toggleButton = page.locator('button:has-text("Show Row Details")').first();
    await toggleButton.click();

    const viewDetailsButton = page.locator('button:has-text("View Row Details")').first();
    await viewDetailsButton.click();

    // Get row count before filtering
    const initialText = await page.locator('text=/\\d+ of \\d+ rows/').textContent();

    // Select "Excellent" filter
    const filterSelect = page.locator('select#rec-filter');
    await filterSelect.selectOption('excellent');
    await page.waitForTimeout(300);

    // Row count should update
    const filteredText = await page.locator('text=/\\d+ of \\d+ rows/').textContent();
    expect(filteredText, 'Filter should change row count').not.toBe(initialText);
  });

  test('accessibility: row breakdown has no violations', async ({ page }) => {
    await page.goto('/stadium/yankees');
    await page.waitForLoadState('networkidle');

    // Enable row view and expand
    await page.waitForSelector('text=All Sections', { timeout: 15000 });
    await page.waitForTimeout(2000);

    const toggleButton = page.locator('button:has-text("Show Row Details")').first();
    await toggleButton.click();

    const viewDetailsButton = page.locator('button:has-text("View Row Details")').first();
    await viewDetailsButton.click();

    // Run accessibility checks on the expanded row breakdown
    const results = await new AxeBuilder({ page })
      .withRules(['button-name', 'label', 'aria-allowed-attr'])
      .analyze();

    expect(results.violations, 'Row breakdown should have no accessibility violations').toEqual([]);
  });
});
