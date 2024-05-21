import { type Page } from '@playwright/test';
import { CONTRACTOR_TYPE } from '../types';

type AgentApplication = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: CONTRACTOR_TYPE;
};
export const fillApplicationForm = async (
  page: Page,
  data: AgentApplication
) => {
  await page.locator('input[name="firstName"]').click();
  await page.locator('input[name="firstName"]').fill(data.firstName);
  await page.locator('input[name="lastName"]').click();
  await page.locator('input[name="lastName"]').fill(data.lastName);
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill(data.email);
  await page.locator('input[name="phone"]').click();
  await page.locator('input[name="phone"]').fill(data.phone);
  await page.getByRole('combobox').click();
  await page.getByLabel(data.type, { exact: true }).click();
};
