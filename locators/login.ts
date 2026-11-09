/**
 * Locators for the login page.
 * Every selector is a data-test attribute, the stable contract the app exposes.
 */
export const LOGIN_LOCATORS = {
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  errorMessage: '[data-test="error"]',
} as const;
