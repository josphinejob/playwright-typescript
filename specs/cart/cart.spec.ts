import { test, expect } from '../../fixtures/auth';
import { CART_LOCATORS } from '../../locators/cart';
import { addItemsToCart } from '../../helpers/cart';

test.describe('Cart', () => {
  test(
    'cart page renders after adding an item',
    { tag: '@sanity' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 1);
      await page.click(CART_LOCATORS.cartIcon);
      await expect(page).toHaveURL(/cart\.html/);
      await expect(page.locator(CART_LOCATORS.cartList)).toBeVisible();
    }
  );

  test(
    'cart badge count matches items added',
    { tag: '@regression' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 2);
      await expect(page.locator(CART_LOCATORS.cartBadge)).toHaveText('2');
    }
  );

  test(
    'added items appear in cart with correct names',
    { tag: '@regression' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      const addedNames = await addItemsToCart(page, 2);
      await page.click(CART_LOCATORS.cartIcon);

      // toHaveText with an array asserts exact text, count, and order together.
      // Matching each name individually with hasText would be a substring check,
      // so one product name contained in another could pass incorrectly.
      await expect(page.locator(CART_LOCATORS.cartItemName)).toHaveText(addedNames);
    }
  );

  test(
    'removing an item from cart updates badge count',
    { tag: '@regression' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 2);
      await page.click(CART_LOCATORS.cartIcon);
      await page.locator(CART_LOCATORS.removeButton).first().click();
      await expect(page.locator(CART_LOCATORS.cartBadge)).toHaveText('1');
    }
  );

  test(
    'continue shopping returns to inventory',
    { tag: '@regression' },
    async ({ page, loginAs }) => {
      await loginAs('standard');
      await addItemsToCart(page, 1);
      await page.click(CART_LOCATORS.cartIcon);
      await page.click(CART_LOCATORS.continueShoppingButton);
      await expect(page).toHaveURL(/inventory\.html/);
    }
  );
});
