import { expect, test } from '@playwright/test';

test.describe('MLB shade trust boundary (production runtime)', () => {
  test('renders the remote-measurement disclosure without browser failures', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedResponses: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/stadium/padres');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toContainText('Petco Park');
    const confidenceNotice = page.getByRole('note', { name: 'Shade data confidence' });
    await expect(confidenceNotice).toBeVisible();
    await expect(confidenceNotice).toContainText('Measurement status: remote reconstruction in progress.');

    await confidenceNotice.getByText('Data details').click();
    await expect(confidenceNotice).toContainText(/Publication gate: withheld \(\d+ blockers\)/);
    await expect(confidenceNotice).toContainText('Independent observation validation: not-started');

    const runtimeState = await page.evaluate(() => ({
      bodyHasContent: document.body.innerText.trim().length > 0,
      errorOverlay: Boolean(document.querySelector(
        '[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay',
      )),
    }));
    expect(runtimeState).toEqual({ bodyHasContent: true, errorOverlay: false });
    expect(pageErrors).toEqual([]);
    expect(consoleErrors, failedResponses.join('\n')).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test('withholds precise 2D and 3D API payloads for every unvalidated park', async ({ request }) => {
    for (const query of [
      'date=2026-08-07&time=13:10',
      'date=2026-08-07&time=13:10&use3d=true',
    ]) {
      const response = await request.get(`/api/stadium/padres/rows/shade?${query}`);
      expect(response.status()).toBe(409);
      expect(response.headers()['cache-control']).toBe('no-store');

      const body = await response.json();
      expect(body).toMatchObject({
        publicationState: 'withheld',
        stadium: { id: 'padres', name: 'Petco Park' },
        confidence: {
          observationValidation: 'not-started',
          publicationBlockers: expect.any(Array),
        },
      });
      expect(body.confidence.publicationBlockers.length).toBeGreaterThan(0);
      expect(body).not.toHaveProperty('sections');
      expect(body).not.toHaveProperty('rows');
    }

    const invalidRequest = await request.get(
      '/api/stadium/padres/rows/shade?date=2026-08-07&time=13:10&typo=true',
    );
    expect(invalidRequest.status()).toBe(400);
    await expect(invalidRequest.json()).resolves.toMatchObject({
      code: 'UNKNOWN_PARAMETER',
      unknownParams: ['typo'],
    });
  });
});
