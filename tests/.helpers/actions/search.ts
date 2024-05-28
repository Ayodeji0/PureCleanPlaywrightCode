
import { expect, Page } from '@playwright/test';

export class SearchPage {
  public page: Page;
  public addressInput = '[id="headlessui-combobox-input-\\:R1l6fbrpda\\:"]';
  public submitButton = 'section:has-text("Make Informed DecisionsUnlock") >> role=button';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

 
  // async enterAddress(address: string) {
  //   await this.page.waitForSelector(this.addressInput).scrollIntoViewIfNeeded();
  //   await this.page.fill(this.addressInput, address);
  // }

  async enterAddress(address: string) {
    await this.page.waitForSelector(this.addressInput);
    await this.page.locator(this.addressInput).scrollIntoViewIfNeeded();
    await this.page.fill(this.addressInput, address);
  }

  
  async submit() {
    await this.page.click(this.submitButton);
  }

  async expectAddressValue(address: string) {
    await expect(this.page.locator(this.addressInput)).toHaveValue(address);
  }
}
