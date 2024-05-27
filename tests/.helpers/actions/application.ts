
import { expect, Page } from '@playwright/test';
import { CONTRACTOR_TYPE } from '../types';

type AgentApplication = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: CONTRACTOR_TYPE;
};

export class ApplicationPage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async clickSignIn() {
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async clickGetStarted() {
    await this.page.getByRole('button', { name: 'Get Started' }).click();
  }

  async clickJoinOwnersearch() {
    await this.page.getByRole('button', { name: 'Join Ownersearch' }).click();
  }

  async clickClose() {
    await this.page.getByRole('button', { name: 'Close' }).click();
  }
  async clickCancel() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async expectJoinOwnersearchFormVisible() {
    await expect(this.page.getByLabel('Join Ownersearch as an Agent')).toBeVisible();
  }

  async expectJoinOwnersearchFormNotVisible() {
    await expect(this.page.getByLabel('Join Ownersearch as an Agent')).not.toBeVisible();
  }

  async expectURL(expectedURL: string) {
    await this.page.waitForURL(expectedURL);
    const actualURL = this.page.url();
    console.log('Actual URL:', actualURL);
    expect(actualURL).toBe(expectedURL);
  }

  async fillAndSubmitForm(agentApplication: AgentApplication) {
    await this.fillApplicationForm(agentApplication);
    await this.page.getByRole('button', { name: 'Submit Application' }).click();
  }

  async fillApplicationForm(data: AgentApplication) {
    await this.page.locator('input[name="firstName"]').click();
    await this.page.locator('input[name="firstName"]').fill(data.firstName);
    await this.page.locator('input[name="lastName"]').click();
    await this.page.locator('input[name="lastName"]').fill(data.lastName);
    await this.page.locator('input[name="email"]').click();
    await this.page.locator('input[name="email"]').fill(data.email);
    await this.page.locator('input[name="phone"]').click();
    await this.page.locator('input[name="phone"]').fill(data.phone);
    await this.page.getByRole('combobox').click();
    await this.page.getByLabel(data.type, { exact: true }).click();
  }

  async expectSubmitButtonDisabled() {
    await expect(this.page.getByRole('button', { name: 'Submit Application' })).not.toHaveAttribute('disabled');
  }

  async expectUserAlreadyExist () {
    await this.page.waitForSelector('text= Application failed. User.');
    await expect(this.page.getByText('Application failed.User already exists')).toBeVisible();
  }
  async expectApplicationSubmitted() {
    await this.page.waitForSelector('text=Application Submitted.');
    await expect(this.page.getByText('Application Submitted.')).toBeVisible();
  }

  async expectSubmissionFailed() {
    console.log("Waiting for 'Failed to submit application.' text to be visible...");
    await this.page.waitForSelector('text=Failed to submit application.', { timeout: 50000 });
    await expect(this.page.getByText('Failed to submit application.')).toBeVisible();
  }
}












































// import { type Page } from '@playwright/test';
// import { CONTRACTOR_TYPE } from '../types';
// type AgentApplication = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   type: CONTRACTOR_TYPE;
// };
// export const fillApplicationForm = async (
//   page: Page,
//   data: AgentApplication
// ) => {
//   await page.getByRole('button',{name: 'Sign In' }).click()
//   await page.getByRole('button',{name: 'Get Started' }).click()
//   await page.locator('input[name="firstName"]').click();
//   await page.locator('input[name="firstName"]').fill(data.firstName);
//   await page.locator('input[name="lastName"]').click();
//   await page.locator('input[name="lastName"]').fill(data.lastName);
//   await page.locator('input[name="email"]').click();
//   await page.locator('input[name="email"]').fill(data.email);
//   await page.locator('input[name="phone"]').click();
//   await page.locator('input[name="phone"]').fill(data.phone);
//   await page.getByRole('combobox').click();
//   await page.getByLabel(data.type, { exact: true }).click();
  
// };
