import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dashboard sem violações críticas de acessibilidade', async ({ page }) => {
  await page.goto('/auth/dashboard');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.length).toBe(0);
});
