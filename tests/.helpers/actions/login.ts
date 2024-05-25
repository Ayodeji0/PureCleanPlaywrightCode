import { Page, Locator } from '@playwright/test';

export class LoginPage {
  public page: Page;
  public emailInputSelector: Locator;
  public getMagicLinkButton: Locator;
  public createAccountLinkSelector: Locator
  public googleLoginButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.emailInputSelector = page. getByPlaceholder("Enter your email address")
    this.googleLoginButton = page.getByLabel("Log in using Google");
    this.getMagicLinkButton = page.getByRole("button", {
        name: "Get Magic Link",
      });
      this.createAccountLinkSelector= page.getByRole("link", { 
        name: "Create Account",
      });
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async fillEmail(email: string) {
    await this.emailInputSelector.fill(email);
  }

  async clickGetMagicLink() {
    await this.getMagicLinkButton.click();
  }
  async clickGoogleLogin() {
    await this.googleLoginButton.click();
  }

  async clickCreateAccount() {
   await this.createAccountLinkSelector.click()
  }

  async getMagicLinkButtonAttribute(attribute: string): Promise<string | null> {
    return this.getMagicLinkButton.getAttribute(attribute);
  }

  async getGoogleSignUpButtonAttribute(attribute: string): Promise<string | null> {
    return this.googleLoginButton.getAttribute(attribute);
  }

  async getMagicLinkButtonIsEnabled(): Promise<boolean> {
    const attribute = await this.getMagicLinkButton.getAttribute('disabled');
    return attribute === null;
  }

  async getGoogleSignUpButtonIsEnabled(): Promise<boolean> {
    const attribute = await this.googleLoginButton.getAttribute('disabled');
    return attribute === null;
  }
}



















//   public page: Page;
//   public emailInputSelector: Locator;
//   public getMagicLinkButtonSelector: Locator;
//   public createAccountLinkSelector : Locator


//   public page: Page;
//   public emailInput: Locator;
//   public getMagicLinkButton: Locator;
//   public googleSignUpButton: Locator;
//   public termsCheckbox: Locator;
//   public signInLink: Locator;
