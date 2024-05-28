import { test as base, expect } from '@playwright/test';
import { SearchPage } from '../.helpers/actions';
import { UrlMapper } from '../.helpers/types';

const BASE_URL: string = process.env.BASE_URL || '';

if (!BASE_URL) {
  throw new Error('BASE_URL environment variable is not defined');
}

//  custom fixture
const test = base.extend<{ searchPage: SearchPage }>({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },
});

test.beforeEach(async ({ searchPage }) => {
  await searchPage.goto(BASE_URL);
});

test.describe('Landing Page - Unauthenticated Search', () => {
  test('should retain user typed address', async ({ searchPage }) => {
    const address = 'independence';
    await searchPage.enterAddress(address);
    await searchPage.expectAddressValue(address);
  });

  test('should go to login page on submit', async ({ searchPage }) => {
    const address = 'independence';
    await searchPage.enterAddress(address);
    await searchPage.submit();

    const url = `${BASE_URL}${UrlMapper.loginUrl}`;
    const query = 'from=%2Fapp%2Fverifications%3Flocation%3D';
    await searchPage.page.waitForURL(`${url}?${query}`); 
    const actualURL = searchPage.page.url();
    // VERIFY THE PAGE IS CORRECT
    expect(actualURL).toBe(`${url}?${query}`); await expect(searchPage.page).toHaveURL(`${url}?${query}`);
  });
});

// test.describe('Landing Page - Authenticated Search', () => {
//   test('should go to verification request page on submit', async ({ searchPage }) => {
//     // Todo: Add login action
//     const address = 'independence';
//     await searchPage.enterAddress(address);
//     await searchPage.submit();

//     const url = `${BASE_URL}${UrlMapper.verificationsUrl}`;
//     await expect(searchPage.page).toHaveURL(`${url}?location%3D${address}`);
//   });
// });


