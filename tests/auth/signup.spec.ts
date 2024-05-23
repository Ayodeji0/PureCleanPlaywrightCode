import { test as base, expect, Page } from '@playwright/test';
import { UrlMapper } from '../.helpers/types';
import { loginEmailSuccess } from '../.helpers/seed/data/auth';
import { fillSignupForm } from '../.helpers/actions/auth';
import { SignupPage } from '../.helpers/actions';

// CUSTOM FIXTURES TO BE USED IN THE TEST SUITES
type MyFixtures = {
  signupPage: SignupPage;
};

const test = base.extend<MyFixtures>({
  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },
});

// BASE URL FOR THE APPLICATION
const baseURL = process.env.BASE_URL

// NAVIGATE TO SIGNUPPAGE BEFORE EACH TEST
test.beforeEach(async ({ page }) => {
  await page.goto(`${baseURL}${UrlMapper.signupUrl}`);
});

// Describe block for signup form tests
test.describe('Auth - Signup Form', () => {

 // VERIFY THAT LOGIN BUTTON REMAINS DISABLE UNTIL TERMS AND CONDITIONS BUTTON IS TRIGGERED
  test('login buttons are disabled until T&C accepted', async ({ signupPage }) => {
    await expect(signupPage.getMagicLinkButton).toHaveAttribute('disabled', '');
    await expect(signupPage.googleSignUpButton).toHaveAttribute('disabled', '');
  });

  // VERIFY THAT EMAIL BUTTON REMAINS DISABLE WHEN FORM IS EMPTY
  test('email login button is disabled on empty form', async ({ signupPage }) => {
    await signupPage.clickTermsCheckbox();
    await expect(signupPage.getMagicLinkButton).toHaveAttribute('disabled', '');
  });

  // ASSERTION TO CONFIRM IF USER CAN GO TO THE LOGIN PAGE
  test('should be able to go to login page', async ({ signupPage, page }) => {
    await signupPage.clickSignInLink();
    await expect(page).toHaveURL(`${baseURL}${UrlMapper.loginUrl}`);
  });

  // ASSERTION TO CONFIRM TOAST IS CREATED 
  test('should show toast if signup token is created', async ({ signupPage }) => {
    await fillSignupForm(signupPage, { email: loginEmailSuccess });
    await signupPage.clickGetMagicLink();
    expect(await signupPage.isToastVisible('A signup link has been sent')).toBe(true);
  });
});
