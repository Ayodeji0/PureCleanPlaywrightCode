import { test, expect } from '@playwright/test';
import { UrlMapper } from '../.helpers/types';

import { CONTRACTOR_TYPE } from '../.helpers/types';
import { fillApplicationForm } from '../.helpers/actions';

const BASE_URL = process.env.BASE_URL;
const apiURL = process.env.GRAPHQL_API_ENDPOINT!;
test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE_URL}`);
});

test.describe('Landing Page - Submit Application', () => {
  test('click on the sign in button to route to the login page', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    const expectedURL = `${BASE_URL}${UrlMapper.loginUrl}`;
    await page.waitForURL(expectedURL);
    const actualURL = page.url();
    // Log the actual URL
    console.log('Actual URL:', actualURL);

    // Compare the actual URL with the expected URL
    expect(actualURL).toBe(expectedURL);
  });

  test('click on the sign in button to route to the sign up page', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Started' }).click();
    const expectedURL = `${BASE_URL}${UrlMapper.signupUrl}`;
    await page.waitForURL(expectedURL);
    const actualURL = page.url();
    // Log the actual URL
    console.log('Actual URL:', actualURL);

    // Compare the actual URL with the expected URL
    expect(actualURL).toBe(expectedURL);
  });
  
  test('"Join Ownersearch" should open form', async ({ page }) => {
    await page.getByRole('button', { name: 'Join Ownersearch' }).click();
    await expect(page.getByLabel('Join Ownersearch as an Agent')).toBeVisible();
  });

  test('x button should close form', async ({ page }) => {
    await page.getByRole('button', { name: 'Join Ownersearch' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(
      page.getByLabel('Join Ownersearch as an Agent')
    ).not.toBeVisible();
  });

  test('submit button should be disabled for missing required fields', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Join Ownersearch' }).click();
    const agentApplication = {
      firstName: 'Agent',
      lastName: 'One',
      email: 'agent.one@email.com',
      phone: '',
      type: CONTRACTOR_TYPE.SURVEYOR,
    };
    await fillApplicationForm(page, agentApplication);
    await expect(
      page.getByRole('button', { name: 'Submit Application' })
    ).toHaveAttribute('disabled');
  });

  test('completed form should submit successfully', async ({ page }) => {
    await page.getByRole('button', { name: 'Join Ownersearch' }).click();
    const agentApplication = {
      firstName: 'Agent',
      lastName: 'One',
      email: 'agent.one@email.com',
      phone: '1234567890',
      type: CONTRACTOR_TYPE.AGENT,
    };
    await fillApplicationForm(page, agentApplication);
    await page.getByRole('button', { name: 'Submit Application' }).click();
    await expect(page.getByText('Application Submitted.')).toBeVisible();
  });

  test('should show error if submission fails', async ({ page }) => {
    await page.getByRole('button', { name: 'Join Ownersearch' }).click();
    const agentApplication = {
      firstName: 'Agent',
      lastName: 'Two',
      email: 'agent.two@email.com',
      phone: '1234567809',
      type: CONTRACTOR_TYPE.AGENT,
    };
    await page.route(apiURL, (route) => route.abort());
    await fillApplicationForm(page, agentApplication);
    await page.getByRole('button', { name: 'Submit Application' }).click();
    await expect(page.getByText('Failed to submit application.')).toBeVisible();
  });
});
