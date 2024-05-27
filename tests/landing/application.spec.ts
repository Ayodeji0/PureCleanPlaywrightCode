
import { test as baseTest } from '@playwright/test';
import { ApplicationPage } from '../.helpers/actions';
import { UrlMapper, CONTRACTOR_TYPE } from '../.helpers/types';

const BASE_URL = process.env.BASE_URL;
const API_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error('BASE_URL environment variable is not defined');
}
if (!API_URL) {
  throw new Error('API_URL environment variable is not defined');
}

interface MyFixtures {
  applicationPage: ApplicationPage;
}

const test = baseTest.extend<MyFixtures>({
  applicationPage: async ({ page }, use) => {
    const applicationPage = new ApplicationPage(page);
    await use(applicationPage);
  },
});

test.beforeEach(async ({ applicationPage }) => {
  return await applicationPage.goto(BASE_URL);
});

test.describe('Landing Page - Submit Application', () => {
  test('click on the sign in button to route to the login page', async ({ applicationPage }) => {
    await applicationPage.clickSignIn();
    await applicationPage.expectURL(`${BASE_URL}${UrlMapper.loginUrl}`);
  });

  test('click on the sign in button to route to the sign up page', async ({ applicationPage }) => {
    await applicationPage.clickGetStarted();
    await applicationPage.expectURL(`${BASE_URL}${UrlMapper.signupUrl}`);
  });

  test('"Join Ownersearch" should open form', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    await applicationPage.expectJoinOwnersearchFormVisible();
  });

  test('x button should close form', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    await applicationPage.clickClose();
    await applicationPage.expectJoinOwnersearchFormNotVisible();
  });
  test('cancel button should cancel form', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    await applicationPage.clickCancel();
    await applicationPage.expectJoinOwnersearchFormNotVisible();
  });

  test('submit button should be disabled for missing required fields', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    const agentApplication = {
      firstName: 'Agent4',
      lastName: 'One',
      email: 'agent.one@email.com',
      phone: '',
      type: CONTRACTOR_TYPE.SURVEYOR,
    };
    await applicationPage.fillAndSubmitForm(agentApplication);
    await applicationPage.expectSubmitButtonDisabled();
  });

  test('completed form should submit successfully', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    const agentApplication = {
      firstName: 'solomon',
      lastName: 'Eugene',
      email: 'eugene.one@email.com',
      phone: '1326497382',
      type: CONTRACTOR_TYPE.AGENT,
    };
    await applicationPage.fillAndSubmitForm(agentApplication);
    await applicationPage.expectApplicationSubmitted();
  });
  test('submitting same form multiple times', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    const agentApplication = {
      firstName: 'solomon',
      lastName: 'Eugene',
      email: 'eugene.one@email.com',
      phone: '1326497382',
      type: CONTRACTOR_TYPE.AGENT,
    };
    await applicationPage.fillAndSubmitForm(agentApplication);
    await applicationPage.expectUserAlreadyExist();
  });

  test('should show error if submission fails', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    const agentApplication = {
      firstName: 'Agent',
      lastName: 'Two',
      email: 'agent.two@email.com',
      phone: '1234567809',
      type: CONTRACTOR_TYPE.AGENT,
    };
    await applicationPage.page.route(API_URL, (route) => route.abort());
    await applicationPage.fillAndSubmitForm(agentApplication);
    await applicationPage.expectSubmissionFailed();
  });
});

















































// import { test, expect } from '@playwright/test';
// import { UrlMapper } from '../.helpers/types';

// import { CONTRACTOR_TYPE } from '../.helpers/types';
// import { fillApplicationForm } from '../.helpers/actions';

// const BASE_URL = process.env.BASE_URL;
// const apiURL = process.env.GRAPHQL_API_ENDPOINT!;
// test.beforeEach(async ({ page }) => {
//   await page.goto(`${BASE_URL}`);
// });

// test.describe('Landing Page - Submit Application', () => {
//   test('click on the sign in button to route to the login page', async ({ page }) => {
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     const expectedURL = `${BASE_URL}${UrlMapper.loginUrl}`;
//     await page.waitForURL(expectedURL);
//     const actualURL = page.url();
//     // Log the actual URL
//     console.log('Actual URL:', actualURL);

//     // Compare the actual URL with the expected URL
//     expect(actualURL).toBe(expectedURL);
//   });

//   test('click on the sign in button to route to the sign up page', async ({ page }) => {
//     await page.getByRole('button', { name: 'Get Started' }).click();
//     const expectedURL = `${BASE_URL}${UrlMapper.signupUrl}`;
//     await page.waitForURL(expectedURL);
//     const actualURL = page.url();
//     // Log the actual URL
//     console.log('Actual URL:', actualURL);

//     // Compare the actual URL with the expected URL
//     expect(actualURL).toBe(expectedURL);
//   });
  
//   test('"Join Ownersearch" should open form', async ({ page }) => {
//     await page.getByRole('button', { name: 'Join Ownersearch' }).click();
//     await expect(page.getByLabel('Join Ownersearch as an Agent')).toBeVisible();
//   });

//   test('x button should close form', async ({ page }) => {
//     await page.getByRole('button', { name: 'Join Ownersearch' }).click();
//     await page.getByRole('button', { name: 'Close' }).click();
//     await expect(
//       page.getByLabel('Join Ownersearch as an Agent')
//     ).not.toBeVisible();
//   });

//   test('submit button should be disabled for missing required fields', async ({
//     page,
//   }) => {
//     await page.getByRole('button', { name: 'Join Ownersearch' }).click();
//     const agentApplication = {
//       firstName: 'Agent',
//       lastName: 'One',
//       email: 'agent.one@email.com',
//       phone: '',
//       type: CONTRACTOR_TYPE.SURVEYOR,
//     };
//     await fillApplicationForm(page, agentApplication);
//     await expect(
//       page.getByRole('button', { name: 'Submit Application' })
//     ).toHaveAttribute('disabled');
//   });

//   test('completed form should submit successfully', async ({ page }) => {
//     await page.getByRole('button', { name: 'Join Ownersearch' }).click();
//     const agentApplication = {
//       firstName: 'Agent',
//       lastName: 'One',
//       email: 'agent.one@email.com',
//       phone: '1234567890',
//       type: CONTRACTOR_TYPE.AGENT,
//     };
//     await fillApplicationForm(page, agentApplication);
//     await page.getByRole('button', { name: 'Submit Application' }).click();
//     await expect(page.getByText('Application Submitted.')).toBeVisible();
//   });

//   test('should show error if submission fails', async ({ page }) => {
//     await page.getByRole('button', { name: 'Join Ownersearch' }).click();
//     const agentApplication = {
//       firstName: 'Agent',
//       lastName: 'Two',
//       email: 'agent.two@email.com',
//       phone: '1234567809',
//       type: CONTRACTOR_TYPE.AGENT,
//     };
//     await page.route(apiURL, (route) => route.abort());
//     await fillApplicationForm(page, agentApplication);
//     await page.getByRole('button', { name: 'Submit Application' }).click();
//     await expect(page.getByText('Failed to submit application.')).toBeVisible();
//   });
// });
