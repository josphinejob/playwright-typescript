import type { Page } from '@playwright/test';
import { PRODUCT_LOCATORS } from '../locators/products';
import { STABLE_URLS } from '../test-data';

/**
 * Add the first N items from the inventory to the cart.
 * Navigates to the inventory page first, then adds each item in listed order.
 *
 * Returns the names of the items added, so tests can assert cart contents
 * against what was actually added rather than against hardcoded names.
 */
export async function addItemsToCart(page: Page, count: number): Promise<string[]> {
  await page.goto(STABLE_URLS.inventory);

  const items = page.locator(PRODUCT_LOCATORS.inventoryItem);
  const available = await items.count();
  const toAdd = Math.min(count, available);
  const addedNames: string[] = [];

  for (let i = 0; i < toAdd; i++) {
    // Scope the name and the button to the same item element so the two stay
    // paired. Reading names and clicking buttons through separate page-level
    // locators would rely on their DOM orders happening to line up.
    const item = items.nth(i);
    const name = await item.locator(PRODUCT_LOCATORS.itemName).innerText();
    addedNames.push(name.trim());
    await item.locator(PRODUCT_LOCATORS.addToCartButton).click();
  }

  return addedNames;
}
