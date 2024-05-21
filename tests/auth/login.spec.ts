import { test, expect } from '@playwright/test';

import { UrlMapper } from '../.helpers/types';
import {
  loginEmailFailure,
  loginEmailSuccess,
} from '../.helpers/seed/data/auth';

const baseURL = process.env.NEXTAUTH_URL!;
test.beforeEach(async ({ page }) => {
  await page.goto(`${baseURL}${UrlMapper.loginUrl}`);
});

test.describe.skip('Auth - Login', () => {
  test('email login button is disabled on empty form', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Get Magic Link' })
    ).toHaveAttribute('disabled');
  });

  test('should go to signup page if user has no account', async ({ page }) => {
    await page.getByPlaceholder('Enter your email address').click();
    await page
      .getByPlaceholder('Enter your email address')
      .fill(loginEmailFailure);

    await expect(
      page.getByRole('button', { name: 'Get Magic Link' })
    ).toHaveValue(loginEmailFailure);

    await page.getByRole('button', { name: 'Get Magic Link' }).click();
    await expect(page).toHaveURL(`${baseURL}${UrlMapper.signupUrl}`);
  });

  test('should be able to go to signup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(`${baseURL}${UrlMapper.signupUrl}`);
  });

  test('should go to verify-request page if successful', async ({ page }) => {
    await page.getByPlaceholder('Enter your email address').click();
    await page
      .getByPlaceholder('Enter your email address')
      .fill(loginEmailSuccess);

    await expect(
      page.getByRole('button', { name: 'Get Magic Link' })
    ).toHaveValue(loginEmailFailure);

    await page.getByRole('button', { name: 'Get Magic Link' }).click();
    await expect(page).toHaveURL(`${baseURL}${UrlMapper.verifyRequestUrl}`);
  });
});
