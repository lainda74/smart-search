import { test, expect } from '@playwright/test';

test('should display the main page title', async ({ page }) => {
  await page.goto('/');

  // Expect the main heading to be visible.
  await expect(
    page.getByRole('heading', { name: 'Smart Search Component API' })
  ).toBeVisible();
});

test('should search for and select an item, then display the result', async ({
  page,
}) => {
  await page.goto('/');

  // Find the search input and type 'Savings'
  const searchInput = page.getByPlaceholder(
    'Search accounts, payments, or people...'
  );
  await searchInput.fill('Savings');

  // Click on the 'Savings Account' result item
  await page
    .getByRole('option', { name: 'Savings Account', exact: true })
    .click();

  // Expect the 'Selected Item' section to appear with the correct content
  await expect(page.getByText('Selected Item:')).toBeVisible();
  await expect(page.getByText(/"title": "Savings Account"/)).toBeVisible();
});