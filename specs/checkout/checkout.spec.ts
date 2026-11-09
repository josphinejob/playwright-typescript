import { test, expect } from '../../fixtures/auth';
import { CHECKOUT_LOCATORS } from '../../locators/checkout';
import { CART_LOCATORS } from '../../locators/cart';
import { addItemsToCart } from '../../helpers/cart';

test.describe('Checkout', () => {
  test(
    'checkout flow completes with valid details',
    { tag: '@sanity' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 1);
      await page.click(CART_LOCATORS.cartIcon);
      await page.click(CART_LOCATORS.checkoutButton);

      // Step one, customer info
      await page.fill(CHECKOUT_LOCATORS.firstNameInput, 'Test');
      await page.fill(CHECKOUT_LOCATORS.lastNameInput, 'User');
      await page.fill(CHECKOUT_LOCATORS.postalCodeInput, '2000');
      await page.click(CHECKOUT_LOCATORS.continueButton);

      // Step two, order overview
      await expect(page.locator(CHECKOUT_LOCATORS.summaryList)).toBeVisible();
      await expect(page.locator(CHECKOUT_LOCATORS.finishButton)).toBeVisible();
      await page.click(CHECKOUT_LOCATORS.finishButton);

      // Confirmation
      await expect(page.locator(CHECKOUT_LOCATORS.confirmationHeader)).toBeVisible();
      await expect(page.locator(CHECKOUT_LOCATORS.confirmationHeader)).toContainText('Thank you');
    }
  );

  test(
    'checkout step one shows error when first name is missing',
    { tag: '@regression' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 1);
      await page.click(CART_LOCATORS.cartIcon);
      await page.click(CART_LOCATORS.checkoutButton);

      // Submit without filling any fields
      await page.click(CHECKOUT_LOCATORS.continueButton);
      await expect(page.locator(CHECKOUT_LOCATORS.errorMessage)).toBeVisible();
      await expect(page.locator(CHECKOUT_LOCATORS.errorMessage)).toContainText('First Name is required');
    }
  );

  test(
    'order overview shows item subtotal and tax',
    { tag: '@regression' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 2);
      await page.click(CART_LOCATORS.cartIcon);
      await page.click(CART_LOCATORS.checkoutButton);

      await page.fill(CHECKOUT_LOCATORS.firstNameInput, 'Test');
      await page.fill(CHECKOUT_LOCATORS.lastNameInput, 'User');
      await page.fill(CHECKOUT_LOCATORS.postalCodeInput, '2000');
      await page.click(CHECKOUT_LOCATORS.continueButton);

      await expect(page.locator(CHECKOUT_LOCATORS.subtotalLabel)).toBeVisible();
      await expect(page.locator(CHECKOUT_LOCATORS.taxLabel)).toBeVisible();
      await expect(page.locator(CHECKOUT_LOCATORS.totalLabel)).toBeVisible();

      // Total must contain a dollar amount
      const totalText = await page.locator(CHECKOUT_LOCATORS.totalLabel).innerText();
      expect(totalText).toMatch(/\$\d+\.\d{2}/);
    }
  );

  test(
    'cancel from overview returns to cart',
    { tag: '@regression' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 1);
      await page.click(CART_LOCATORS.cartIcon);
      await page.click(CART_LOCATORS.checkoutButton);

      await page.fill(CHECKOUT_LOCATORS.firstNameInput, 'Test');
      await page.fill(CHECKOUT_LOCATORS.lastNameInput, 'User');
      await page.fill(CHECKOUT_LOCATORS.postalCodeInput, '2000');
      await page.click(CHECKOUT_LOCATORS.continueButton);

      await page.click(CHECKOUT_LOCATORS.cancelButton);
      await expect(page).toHaveURL(/inventory\.html/);
    }
  );
});
