
import { SignupPage } from '../../.helpers/actions'

export async function fillSignupForm(signupPage: SignupPage, payload: { email: string }): Promise<void> {
  await signupPage.fillEmail(payload.email);
  await signupPage.clickTermsCheckbox();
  await signupPage.clickGetMagicLink();
}

