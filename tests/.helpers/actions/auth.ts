// import { type Page } from '@playwright/test';

// const baseURL = process.env.BASE_URL!;
// export const fillSignupForm = async (page: Page, payload: any) => {
//   await page.goto(`${baseURL}/app/signup`);

//   await page.getByPlaceholder('Enter your email address').click();
//   await page.getByPlaceholder('Enter your email address').fill(payload.email);
//   await page.getByLabel("I agree to OwnerSearch'sTerms").click();
//   await page.getByRole('button', { name: 'Get Magic Link' }).click();
// };


// src/helpers/actions/auth.ts
import { SignupPage } from '../../.helpers/actions'

export async function fillSignupForm(signupPage: SignupPage, payload: { email: string }): Promise<void> {
  await signupPage.fillEmail(payload.email);
  await signupPage.clickTermsCheckbox();
  await signupPage.clickGetMagicLink();
}

