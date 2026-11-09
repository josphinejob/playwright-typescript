/**
 * Stable entry point URLs used across specs.
 * All paths are relative, playwright.config.ts sets the baseURL.
 */
export const STABLE_URLS = {
  home: '/',
  inventory: '/inventory.html',
} as const;

/**
 * SauceDemo issues the same password to every demo account, so one
 * E2E_PASSWORD override applies to all of them.
 */
const PASSWORD = process.env.E2E_PASSWORD ?? 'secret_sauce';

/**
 * Test accounts, keyed by the behaviour each one exercises.
 *
 * `standard` is the account used for normal flows, and its username is
 * overridable so the suite can be pointed at another environment.
 * `locked` and `problem` exist only to trigger SauceDemo's built-in
 * failure behaviours, so their usernames are fixed to this app.
 */
export const TEST_ACCOUNTS = {
  standard: {
    username: process.env.E2E_USERNAME ?? 'standard_user',
    password: PASSWORD,
  },
  locked: {
    username: 'locked_out_user',
    password: PASSWORD,
  },
  problem: {
    username: 'problem_user',
    password: PASSWORD,
  },
} as const;
