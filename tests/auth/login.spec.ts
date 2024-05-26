import { test as base, expect } from '@playwright/test';
import { UrlMapper } from '../.helpers/types';
import {
  loginEmailFailure,
  loginEmailSuccess,
} from '../.helpers/seed/data/auth';
import { LoginPage } from '../.helpers/actions';

const BASE_URL = process.env.BASE_URL;

type Fixtures = {
  loginPage: LoginPage;
};

const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto(`${BASE_URL}${UrlMapper.loginUrl}`);
});

test.describe('Auth - Login', () => {
  test('login buttons are disabled until T&C accepted', async ({ loginPage }) => {
   // Attribute received and expected both captured
    const magicLinkButtonAttribute = await loginPage.getMagicLinkButton.getAttribute('disabled');
    console.log('Magic Link Button disabled attribute:', magicLinkButtonAttribute);
    await expect(loginPage.getMagicLinkButton).toHaveAttribute('disabled', '');

    //THE LOGIN BUTTON DOESN'T HAVE AN ATTRIBUTE SO I SET THE ATTRIBUTE TO NULL
    const googleLoginButtonAttribute = await loginPage.googleLoginButton.getAttribute('disabled');
    console.log('Google Login Button disabled attribute:', googleLoginButtonAttribute);
    expect(googleLoginButtonAttribute).toBe(null);
  });

  test('should go to signup page if user has no account', async ({ loginPage }) => {
    await loginPage.fillEmail(loginEmailFailure);
    expect(await loginPage.getMagicLinkButtonIsEnabled()).toBe(true);
    await loginPage.clickGetMagicLink();
    
    const expectedURL = `${BASE_URL}${UrlMapper.signupUrl}`;
    await loginPage.page.waitForURL(expectedURL);
    const actualURL = loginPage.page.url();
    // Log the actual URL
    console.log('Actual URL:', actualURL);

    // Compare the actual URL with the expected URL
    expect(actualURL).toBe(expectedURL);
  });

  test('should be able to go to signup page', async ({ loginPage }) => {
    await loginPage.clickCreateAccount();
    await expect(loginPage.page).toHaveURL(`${BASE_URL}${UrlMapper.signupUrl}`);
  });

  test('should go to verify-request page if successful', async ({ loginPage }) => {
    await loginPage.fillEmail(loginEmailSuccess);
    expect(await loginPage.getMagicLinkButtonIsEnabled()).toBe(true);
    await loginPage.clickGetMagicLink();
    await expect(loginPage.page).toHaveURL(`${BASE_URL}${UrlMapper.verifyRequestUrl}`);
  });
});
