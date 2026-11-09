/**
 * Locators for the cart page.
 * Every selector is a data-test attribute, the stable contract the app exposes.
 * Cart rows reuse the inventory-item attributes, so the names match the product page.
 */
export const CART_LOCATORS = {
  cartIcon: '[data-test="shopping-cart-link"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
  cartList: '[data-test="cart-list"]',
  cartItem: '[data-test="inventory-item"]',
  cartItemName: '[data-test="inventory-item-name"]',
  cartItemPrice: '[data-test="inventory-item-price"]',
  removeButton: '[data-test^="remove"]',
  checkoutButton: '[data-test="checkout"]',
  continueShoppingButton: '[data-test="continue-shopping"]',
} as const;
