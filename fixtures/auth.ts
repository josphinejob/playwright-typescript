import { test as base } from '@playwright/test';
import { LOGIN_LOCATORS } from '../locators/login';
import { TEST_ACCOUNTS, STABLE_URLS } from '../test-data';

type AccountLabel = keyof typeof TEST_ACCOUNTS;

type AuthFixtures = {
  /**
   * Log in as a named test account before the test body runs.
   * The page is on /inventory.html (product catalog) after loginAs resolves.
   *
   * Usage:
   *   await loginAs('standard');
   *   await loginAs('problem');
   *
   * Account labels are defined in test-data.ts TEST_ACCOUNTS.
   */
  loginAs: (accountLabel: AccountLabel) => Promise<void>;
};

export const test = base.extend<AuthFixtures>({
  loginAs: async ({ page }, use) => {
    await use(async (accountLabel: AccountLabel) => {
      const account = TEST_ACCOUNTS[accountLabel];
      await page.goto(STABLE_URLS.home);
      await page.fill(LOGIN_LOCATORS.usernameInput, account.username);
      await page.fill(LOGIN_LOCATORS.passwordInput, account.password);
      await page.click(LOGIN_LOCATORS.loginButton);
      // Wait for inventory page to confirm successful login
      await page.waitForURL('**/inventory.html');
    });
  },
});

export { expect } from '@playwright/test';
