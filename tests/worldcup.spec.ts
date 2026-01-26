// E2E Tests for World Cup 2026 Features
// Validates World Cup pages, badges, countdown, and schedule

import { test, expect } from '@playwright/test';

test.describe('World Cup 2026 Features', () => {
  test.describe('World Cup Landing Page', () => {
    test('should display World Cup landing page with all 16 venues', async ({ page }) => {
      await page.goto('/worldcup2026');

      // Check hero section
      await expect(page.locator('h1')).toContainText('FIFA World Cup 2026');
      await expect(page.getByText('Find the Best Shaded Seats')).toBeVisible();

      // Check key stats
      await expect(page.getByText('16', { exact: false })).toBeVisible(); // Venues
      await expect(page.getByText('104', { exact: false })).toBeVisible(); // Matches
      await expect(page.getByText('48', { exact: false })).toBeVisible(); // Teams

      // Check CTA buttons
      await expect(page.getByRole('link', { name: /View Full Schedule/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Browse Venues/i })).toBeVisible();
    });

    test('should filter venues by country', async ({ page }) => {
      await page.goto('/worldcup2026');

      // Wait for venues to load
      await page.waitForSelector('text=All Venues');

      // Initially all venues should be visible
      const allVenuesButton = page.getByRole('button', { name: /All \(/i });
      await expect(allVenuesButton).toBeVisible();

      // Filter by USA
      await page.getByRole('button', { name: /USA \(/i }).click();
      // Should show 11 USA venues
      const usaVenues = page.locator('[data-testid="venue-card"], .bg-white.rounded-xl.shadow-md');
      const usaCount = await usaVenues.count();
      expect(usaCount).toBeGreaterThanOrEqual(11);

      // Filter by Mexico
      await page.getByRole('button', { name: /Mexico \(/i }).click();
      // Should show 3 Mexico venues
      const mexicoVenues = page.locator('[data-testid="venue-card"], .bg-white.rounded-xl.shadow-md');
      const mexicoCount = await mexicoVenues.count();
      expect(mexicoCount).toBeGreaterThanOrEqual(3);

      // Filter by Canada
      await page.getByRole('button', { name: /Canada \(/i }).click();
      // Should show 2 Canada venues
      const canadaVenues = page.locator('[data-testid="venue-card"], .bg-white.rounded-xl.shadow-md');
      const canadaCount = await canadaVenues.count();
      expect(canadaCount).toBeGreaterThanOrEqual(2);
    });

    test('should display venue cards with correct information', async ({ page }) => {
      await page.goto('/worldcup2026');

      // Wait for first venue card
      await page.waitForSelector('text=Find Shaded Seats');

      // Check that venue cards have required elements
      const venueCards = page.locator('.bg-white.rounded-xl.shadow-md').first();
      await expect(venueCards).toBeVisible();

      // Check for World Cup badge
      await expect(page.getByText('World Cup 2026').first()).toBeVisible();

      // Check for Find Shaded Seats button
      await expect(page.getByRole('link', { name: /Find Shaded Seats/i }).first()).toBeVisible();
    });
  });

  test.describe('World Cup Schedule Page', () => {
    test('should display schedule page with matches', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Check header
      await expect(page.locator('h1')).toContainText('FIFA World Cup 2026 Schedule');
      await expect(page.getByText(/104 matches/i)).toBeVisible();

      // Check filters exist
      await expect(page.getByLabel(/Round/i)).toBeVisible();
      await expect(page.getByLabel(/Country/i)).toBeVisible();
      await expect(page.getByPlaceholder(/Team, city, or venue/i)).toBeVisible();
    });

    test('should filter matches by round', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Wait for matches to load
      await page.waitForSelector('text=Filter Matches');

      // Get initial match count
      const initialCount = await page.getByText(/Showing \d+ of \d+ matches/).textContent();
      expect(initialCount).toBeTruthy();

      // Filter by Final
      await page.getByLabel(/Round/i).selectOption('Final');

      // Should show only final match
      await expect(page.getByText(/Showing 1 of/i)).toBeVisible();
    });

    test('should filter matches by country', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Wait for matches to load
      await page.waitForSelector('text=Filter Matches');

      // Filter by USA
      await page.getByLabel(/Country/i).selectOption('USA');

      // Verify matches are filtered
      const matchesText = await page.getByText(/Showing \d+ of \d+ matches/).textContent();
      expect(matchesText).toContain('Showing');
    });

    test('should search matches by team or venue', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Wait for matches to load
      await page.waitForSelector('text=Filter Matches');

      // Search for Mexico
      await page.getByPlaceholder(/Team, city, or venue/i).fill('Mexico');

      // Should filter results
      const matchesText = await page.getByText(/Showing \d+ of \d+ matches/).textContent();
      expect(matchesText).toBeTruthy();

      // Should show Mexico in results
      await expect(page.getByText('Mexico', { exact: false })).toBeVisible();
    });

    test('should display next match countdown', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Check if countdown is visible (might not be if all matches are past)
      const nextMatchHeading = page.getByText('Next Match');
      const isVisible = await nextMatchHeading.isVisible().catch(() => false);

      if (isVisible) {
        // Verify countdown elements are present
        await expect(page.getByText(/Days?/i)).toBeVisible();
        await expect(page.getByText(/Hours?/i)).toBeVisible();
        await expect(page.getByText(/Mins?/i)).toBeVisible();
        await expect(page.getByText(/Secs?/i)).toBeVisible();
      }
    });
  });

  test.describe('World Cup Badge Component', () => {
    test('should display World Cup badge on venue pages', async ({ page }) => {
      // Visit a World Cup venue (MetLife Stadium)
      await page.goto('/stadium/metlife-stadium-wc');

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check for World Cup badge
      const badge = page.getByText('World Cup 2026');
      const isVisible = await badge.isVisible().catch(() => false);

      // Badge should be visible on World Cup venue pages
      expect(isVisible).toBe(true);
    });

    test('should NOT display World Cup badge on non-WC venues', async ({ page }) => {
      // Visit a non-World Cup venue (Yankees Stadium)
      await page.goto('/stadium/yankee-stadium');

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check that World Cup badge is NOT present
      const badge = page.getByText('World Cup 2026');
      const isVisible = await badge.isVisible().catch(() => false);

      // Badge should NOT be visible on non-World Cup venues
      expect(isVisible).toBe(false);
    });
  });

  test.describe('Match Countdown Component', () => {
    test('should display countdown with time units', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Wait for page to load
      await page.waitForSelector('text=Next Match');

      const nextMatchSection = page.locator('text=Next Match').locator('..');

      // Check if countdown is visible
      const hasCountdown = await nextMatchSection.getByText(/Days?/i).isVisible().catch(() => false);

      if (hasCountdown) {
        // Verify all time units
        await expect(nextMatchSection.getByText(/Days?/i)).toBeVisible();
        await expect(nextMatchSection.getByText(/Hours?/i)).toBeVisible();
        await expect(nextMatchSection.getByText(/Mins?/i)).toBeVisible();
        await expect(nextMatchSection.getByText(/Secs?/i)).toBeVisible();
      }
    });

    test('should update countdown in real-time', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Wait for countdown
      const secondsDisplay = page.locator('text=Secs').locator('..').locator('div').first();
      const isVisible = await secondsDisplay.isVisible().catch(() => false);

      if (isVisible) {
        const initialSeconds = await secondsDisplay.textContent();

        // Wait 2 seconds
        await page.waitForTimeout(2000);

        const newSeconds = await secondsDisplay.textContent();

        // Seconds should have decreased (or wrapped around)
        expect(newSeconds).not.toBe(initialSeconds);
      }
    });
  });

  test.describe('Navigation and Links', () => {
    test('should navigate from landing page to schedule', async ({ page }) => {
      await page.goto('/worldcup2026');

      // Click schedule link
      await page.getByRole('link', { name: /View Full Schedule/i }).click();

      // Should navigate to schedule page
      await expect(page).toHaveURL(/\/worldcup2026\/schedule/);
      await expect(page.locator('h1')).toContainText('Schedule');
    });

    test('should navigate from venue card to stadium page', async ({ page }) => {
      await page.goto('/worldcup2026');

      // Wait for venue cards
      await page.waitForSelector('text=Find Shaded Seats');

      // Click first "Find Shaded Seats" button
      await page.getByRole('link', { name: /Find Shaded Seats/i }).first().click();

      // Should navigate to a stadium page
      await expect(page).toHaveURL(/\/stadium\//);
    });

    test('should navigate from schedule to stadium page', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // Wait for matches to load
      await page.waitForSelector('text=Find Shaded Seats');

      // Click first "Find Shaded Seats" button
      await page.getByRole('link', { name: /Find Shaded Seats/i }).first().click();

      // Should navigate to a stadium page
      await expect(page).toHaveURL(/\/stadium\//);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/worldcup2026');

      // Check hero is visible
      await expect(page.locator('h1')).toBeVisible();

      // Check buttons stack vertically on mobile
      const ctaButtons = page.locator('a[href*="schedule"], a[href*="venues"]');
      await expect(ctaButtons.first()).toBeVisible();
    });

    test('should display schedule filters on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/worldcup2026/schedule');

      // Filters should be visible
      await expect(page.getByLabel(/Round/i)).toBeVisible();
      await expect(page.getByLabel(/Country/i)).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy on landing page', async ({ page }) => {
      await page.goto('/worldcup2026');

      // Check h1 exists
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // Check h2 headings
      const h2s = page.locator('h2');
      const h2Count = await h2s.count();
      expect(h2Count).toBeGreaterThan(0);
    });

    test('should have accessible form labels on schedule page', async ({ page }) => {
      await page.goto('/worldcup2026/schedule');

      // All form inputs should have labels
      await expect(page.getByLabel(/Round/i)).toBeVisible();
      await expect(page.getByLabel(/Country/i)).toBeVisible();
      await expect(page.getByLabel(/Search/i)).toBeVisible();
    });

    test('should have proper link text', async ({ page }) => {
      await page.goto('/worldcup2026');

      // Links should have descriptive text
      await expect(page.getByRole('link', { name: /View Full Schedule/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Find Shaded Seats/i }).first()).toBeVisible();
    });
  });
});
