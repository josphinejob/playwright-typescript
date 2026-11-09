/**
 * Locators for the checkout flow.
 * Covers checkout step one (info), step two (overview), and completion.
 * Every selector is a data-test attribute, the stable contract the app exposes.
 */
export const CHECKOUT_LOCATORS = {
  // Step one, customer info
  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  postalCodeInput: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',
  errorMessage: '[data-test="error"]',

  // Step two, order overview
  summaryList: '[data-test="cart-list"]',
  summaryItem: '[data-test="inventory-item"]',
  subtotalLabel: '[data-test="subtotal-label"]',
  taxLabel: '[data-test="tax-label"]',
  totalLabel: '[data-test="total-label"]',
  finishButton: '[data-test="finish"]',
  cancelButton: '[data-test="cancel"]',

  // Confirmation
  confirmationHeader: '[data-test="complete-header"]',
  confirmationText: '[data-test="complete-text"]',
  backHomeButton: '[data-test="back-to-products"]',
} as const;
