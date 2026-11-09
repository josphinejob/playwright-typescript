/**
 * Locators for the product inventory page.
 * Every selector is a data-test attribute, the stable contract the app exposes.
 */
export const PRODUCT_LOCATORS = {
  inventoryList: '[data-test="inventory-list"]',
  inventoryItem: '[data-test="inventory-item"]',
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',
  addToCartButton: '[data-test^="add-to-cart"]',
  removeButton: '[data-test^="remove"]',
  sortDropdown: '[data-test="product-sort-container"]',
  pageTitle: '[data-test="title"]',
} as const;
