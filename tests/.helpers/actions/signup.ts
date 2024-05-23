
import { Page, Locator } from '@playwright/test';

export class SignupPage {
  public page: Page;
  public emailInput: Locator;
  public getMagicLinkButton: Locator;
  public googleSignUpButton: Locator;
  public termsCheckbox: Locator;
  public signInLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("Enter your email address");
    this.getMagicLinkButton = page.getByRole("button", {
      name: "Get Magic Link",
    });
    this.googleSignUpButton = page.getByLabel("Sign up using Google");
    this.termsCheckbox = page.getByLabel("I agree to OwnerSearch'sTerms");
    this.signInLink = page.getByRole("link", { name: "Sign In" });
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }

  async clickGetMagicLink(): Promise<void> {
    await this.getMagicLinkButton.click();
  }

  async clickGoogleSignUp(): Promise<void> {
    await this.googleSignUpButton.click();
  }

  async clickTermsCheckbox(): Promise<void> {
    await this.termsCheckbox.click();
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
  }

  async getMagicLinkButtonAttribute(attribute: string): Promise<string | null> {
    return this.getMagicLinkButton.getAttribute(attribute);
  }

  async getGoogleSignUpButtonAttribute(attribute: string): Promise<string | null> {
    return this.googleSignUpButton.getAttribute(attribute);
  }

  async isToastVisible(toastText: string): Promise<boolean> {
    return this.page.getByText(toastText).isVisible();
  }
}








