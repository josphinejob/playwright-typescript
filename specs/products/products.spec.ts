import { test, expect } from '../../fixtures/auth';
import { PRODUCT_LOCATORS } from '../../locators/products';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('standard');
  });

  test(
    'inventory page renders product list',
    { tag: '@sanity' },
    async ({ page }) => {
      await expect(page.locator(PRODUCT_LOCATORS.inventoryList)).toBeVisible();
      const items = page.locator(PRODUCT_LOCATORS.inventoryItem);
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    }
  );

  test(
    'each product shows name and price',
    { tag: '@regression' },
    async ({ page }) => {
      const items = page.locator(PRODUCT_LOCATORS.inventoryItem);
      const count = await items.count();

      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        await expect(item.locator(PRODUCT_LOCATORS.itemName)).toBeVisible();
        await expect(item.locator(PRODUCT_LOCATORS.itemPrice)).toBeVisible();
        const priceText = await item.locator(PRODUCT_LOCATORS.itemPrice).innerText();
        // Price must start with $ and contain a numeric value
        expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
      }
    }
  );

  test(
    'sort by price low to high reorders the list',
    { tag: '@regression' },
    async ({ page }) => {
      await page.selectOption(PRODUCT_LOCATORS.sortDropdown, 'lohi');

      const prices = page.locator(PRODUCT_LOCATORS.itemPrice);
      const count = await prices.count();
      const priceValues: number[] = [];

      for (let i = 0; i < count; i++) {
        const text = await prices.nth(i).innerText();
        priceValues.push(parseFloat(text.replace('$', '')));
      }

      // Each price must be less than or equal to the next
      for (let i = 0; i < priceValues.length - 1; i++) {
        expect(priceValues[i]).toBeLessThanOrEqual(priceValues[i + 1]);
      }
    }
  );

  test(
    'add to cart button changes to remove after clicking',
    { tag: '@regression' },
    async ({ page }) => {
      const firstAddButton = page.locator(PRODUCT_LOCATORS.addToCartButton).first();
      await firstAddButton.click();
      // After adding, the button text changes to Remove
      await expect(page.locator(PRODUCT_LOCATORS.removeButton).first()).toBeVisible();
    }
  );
});
