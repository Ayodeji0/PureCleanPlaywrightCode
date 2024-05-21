import { test, expect } from '@playwright/test';

import { UrlMapper } from '../.helpers/types';
import { loginEmailSuccess } from '../.helpers/seed/data/auth';
import { fillSignupForm } from '../.helpers/actions/auth';

const baseURL = process.env.NEXTAUTH_URL!;
test.beforeEach(async ({ page }) => {
  await page.goto(`${baseURL}${UrlMapper.signupUrl}`);
});

test.describe.skip('Auth - Signup Form', () => {
  test('login buttons are disabled until T&C accepted', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Get Magic Link' })
    ).toHaveAttribute('disabled');
    await expect(page.getByLabel('Sign up using Google')).toHaveAttribute(
      'disabled'
    );
  });

  test('email login button is disabled on empty form', async ({ page }) => {
    await page.getByLabel("I agree to OwnerSearch'sTerms").click();
    await expect(
      page.getByRole('button', { name: 'Get Magic Link' })
    ).toHaveAttribute('disabled');
  });

  test('should be able to go to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(`${baseURL}${UrlMapper.loginUrl}`);
  });

  test('should show toast if signup token is created', async ({ page }) => {
    await fillSignupForm(page, { email: loginEmailSuccess });
    await expect(page.getByText('A signup link has been sent')).toBeVisible();
  });
});
