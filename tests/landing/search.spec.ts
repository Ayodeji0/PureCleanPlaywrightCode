import { test, expect } from '@playwright/test';

import {
  searchFormSelectState,
  searchFormEnterAddress,
} from '../.helpers/actions/search';
import { UrlMapper } from '../.helpers/types';

const baseURL = process.env.NEXTAUTH_URL!;
test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

test.describe('Landing Page - Unauthenticated Search', () => {
  test('should be able to select state', async ({ page }) => {
    const state = 'Enugu';
    await searchFormSelectState(page, state);
    await expect(page.getByRole('main')).toContainText(state);
  });

  test('should retain user typed address', async ({ page }) => {
    const address = 'independence';
    await searchFormEnterAddress(page, address);
    await expect(
      page.locator('[id="headlessui-combobox-input-\\:r2\\:"]')
    ).toHaveValue(address);
  });

  test.skip('should go to login page on submit', async ({ page }) => {
    const address = 'independence';
    await searchFormEnterAddress(page, address);
    await page
      .locator('section')
      .filter({ hasText: 'Make Informed DecisionsUnlock' })
      .getByRole('button')
      .click();

    const url = `${baseURL}${UrlMapper.loginUrl}`;
    const query = `from=%2Fapp%2Fverifications%3Flocation%3D${address}`;
    await expect(page).toHaveURL(`${url}?${query}`);
  });
});

test.describe('Landing Page - Authenticated Search', () => {
  test.skip('should go to verification request page on submit', async ({
    page,
  }) => {
    // Todo: Add login action
    const address = 'independence';
    await searchFormEnterAddress(page, address);
    await page
      .locator('section')
      .filter({ hasText: 'Make Informed DecisionsUnlock' })
      .getByRole('button')
      .click();

    const url = `${baseURL}${UrlMapper.verificationsUrl}`;
    await expect(page).toHaveURL(`${url}?location%3D${address}`);
  });
});
