import { test, expect } from '@playwright/test';
import { LOGIN_LOCATORS } from '../../locators/login';
import { TEST_ACCOUNTS, STABLE_URLS } from '../../test-data';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STABLE_URLS.home);
  });

  test(
    'login page renders with username and password fields',
    { tag: '@sanity' },
    async ({ page }) => {
      await expect(page.locator(LOGIN_LOCATORS.usernameInput)).toBeVisible();
      await expect(page.locator(LOGIN_LOCATORS.passwordInput)).toBeVisible();
      await expect(page.locator(LOGIN_LOCATORS.loginButton)).toBeVisible();
    }
  );

  test(
    'standard user logs in and reaches inventory page',
    { tag: '@sanity' },
    async ({ page }) => {
      await page.fill(LOGIN_LOCATORS.usernameInput, TEST_ACCOUNTS.standard.username);
      await page.fill(LOGIN_LOCATORS.passwordInput, TEST_ACCOUNTS.standard.password);
      await page.click(LOGIN_LOCATORS.loginButton);
      await expect(page).toHaveURL(/inventory\.html/);
    }
  );

  test(
    'locked out user sees error message',
    { tag: '@regression' },
    async ({ page }) => {
      await page.fill(LOGIN_LOCATORS.usernameInput, TEST_ACCOUNTS.locked.username);
      await page.fill(LOGIN_LOCATORS.passwordInput, TEST_ACCOUNTS.locked.password);
      await page.click(LOGIN_LOCATORS.loginButton);
      await expect(page.locator(LOGIN_LOCATORS.errorMessage)).toBeVisible();
      await expect(page.locator(LOGIN_LOCATORS.errorMessage)).toContainText('locked out');
    }
  );

  test(
    'empty credentials show error message',
    { tag: '@regression' },
    async ({ page }) => {
      await page.click(LOGIN_LOCATORS.loginButton);
      await expect(page.locator(LOGIN_LOCATORS.errorMessage)).toBeVisible();
      await expect(page.locator(LOGIN_LOCATORS.errorMessage)).toContainText('Username is required');
    }
  );

  test(
    'wrong password shows error message',
    { tag: '@regression' },
    async ({ page }) => {
      await page.fill(LOGIN_LOCATORS.usernameInput, TEST_ACCOUNTS.standard.username);
      await page.fill(LOGIN_LOCATORS.passwordInput, 'wrong_password');
      await page.click(LOGIN_LOCATORS.loginButton);
      await expect(page.locator(LOGIN_LOCATORS.errorMessage)).toBeVisible();
      await expect(page.locator(LOGIN_LOCATORS.errorMessage)).toContainText('Username and password do not match');
    }
  );
});
