
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

 
  /*
  IN THE TWO TEST BELOW ONE TEST WILL PASS AT A TIME  FOR THIS REASON:
 These tests will pass when you enter fresh values in the first test and run but if you submit the same
 values  two or multiple times, it will fail, you will get an error. The error is what has been 
 captured in the next test under it. in other words enter fresh values 
 for the first test so for both test to pass
 */

  test('completed form should submit successfully', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    const agentApplication = {
      firstName: 'alasile',
      lastName: 'kutes',
      email: 'kuas.de@email.com',
      phone: '3351702321',
      type: CONTRACTOR_TYPE.AGENT,
    };
    await applicationPage.fillAndSubmitForm(agentApplication);
    await applicationPage.expectApplicationSubmitted();
  });
  // THE TEST WILL PASS WHEN YOU USE THE SAME VALUE TWO OR MULTIPLE TIMES FOR SUBMISSION 
  test('submitting same form multiple times', async ({ applicationPage }) => {
    await applicationPage.clickJoinOwnersearch();
    const agentApplication = {
      firstName: 'alasile',
      lastName: 'kutes',
      email: 'kuas.de@email.com',
      phone: '3351702321',
      type: CONTRACTOR_TYPE.AGENT,
    };
    await applicationPage.fillAndSubmitForm(agentApplication);
    await applicationPage.expectUserAlreadyExist();
  });

  // test('should show error if submission fails', async ({ applicationPage }) => {
  //   await applicationPage.clickJoinOwnersearch();
  //   const agentApplication = {
  //     firstName: 'Agent',
  //     lastName: 'Two',
  //     email: 'agent.two@email.com',
  //     phone: '1234567809',
  //     type: CONTRACTOR_TYPE.AGENT,
  //   };
  //   await applicationPage.page.route(API_URL, (route) => route.abort());
  //   await applicationPage.fillAndSubmitForm(agentApplication);
  //   await applicationPage.expectSubmissionFailed();
  // });
});
