import { type Page } from '@playwright/test';

export const searchFormSelectState = async (page: Page, value: string) => {
  await page.getByRole('combobox').first().click();
  await page.getByPlaceholder('Search State...').fill(value);
  await page.getByRole('option', { name: value }).click();
};

// type address and press enter. Do not wait for google places
export const searchFormEnterAddress = async (page: Page, value: string) => {
  await page.locator('[id="headlessui-combobox-input-\\:r2\\:"]').click();
  await page.locator('[id="headlessui-combobox-input-\\:r2\\:"]').fill(value);
  await page
    .locator('[id="headlessui-combobox-input-\\:r2\\:"]')
    .press('Enter');
};
