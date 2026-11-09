# playwright-typescript

Playwright E2E framework in TypeScript. Tests run against [SauceDemo](https://www.saucedemo.com), a public demo e-commerce site.

## What this demonstrates

- Typed locator constants per domain, one file per feature, `data-test` attributes only
- Custom Playwright fixtures for authentication, login once, injected into each test
- Shared helpers for common interactions (cart operations)
- `@sanity` and `@regression` test tagging for selective execution
- Credentials and URLs in `test-data.ts` backed by environment variables, never hardcoded

## Structure

```
playwright-typescript/
├── locators/           # Typed locator constants, one file per domain
│   ├── login.ts
│   ├── products.ts
│   ├── cart.ts
│   └── checkout.ts
├── fixtures/
│   └── auth.ts         # loginAs fixture, resolves account by label, handles login flow
├── helpers/
│   └── cart.ts         # Shared cart interaction helpers
├── specs/
│   ├── login/          # Login happy path and error states
│   ├── products/       # Inventory page, sorting, add to cart
│   ├── cart/           # Cart operations and badge count
│   └── checkout/       # Full checkout flow and validation
├── test-data.ts        # Stable URLs and test account credentials
├── .env.example        # Template for local environment overrides
└── playwright.config.ts
```

## Locator strategy

Locators are collected in per-domain constant files rather than scattered across specs. When a selector changes, one line changes and all tests that reference it are fixed.

```typescript
// locators/cart.ts
export const CART_LOCATORS = {
  cartIcon: '[data-test="shopping-cart-link"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
  cartList: '[data-test="cart-list"]',
  checkoutButton: '[data-test="checkout"]',
} as const;
```

Every selector in this repo is a `data-test` attribute. No CSS classes, no XPath, no positional selectors.

Playwright's own guidance puts user-facing locators first, `getByRole` and `getByLabel` before test IDs, because they assert what a user perceives and catch accessibility regressions as a side effect. That ordering assumes the application does not already publish a test contract. SauceDemo does: every interactive control and content element carries a `data-test` attribute, including the cart badge and the order summary labels. When an application ships attributes specifically for automation, those are the most stable thing available, and reaching past them for a role selector trades stability for nothing. On an application without that coverage, the same locator files would hold `getByRole` and `getByLabel` calls instead, and nothing else about the structure would change.

## Auth fixture

The `loginAs` fixture handles the login flow before the test body runs. Tests declare what account they need rather than repeating the login steps inline.

```typescript
import { test, expect } from '../../fixtures/auth';

test('adds item to cart', { tag: '@regression' }, async ({ page, loginAs }) => {
  await loginAs('standard');
  // page is on /inventory.html, authenticated
});
```

Available accounts: `standard`, `locked`, `problem`, defined in `test-data.ts`. Only `standard` has an overridable username, since `locked` and `problem` exist to trigger SauceDemo's built-in failure behaviours and do not exist on other environments.

## Running tests

```bash
# Install dependencies
npm install
npx playwright install chromium

# Type check
npm run typecheck

# Full suite
npm test

# Sanity only
npm run test:sanity

# Regression only
npm run test:regression

# Headed (browser visible)
npm run test:headed

# View HTML report (run npm test first to generate it)
npm run report
```

## Environment variables

Every variable is optional. The defaults point at the public SauceDemo instance, so the suite runs with no setup. Copy `.env.example` to `.env` to override any of them.

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | Target base URL |
| `E2E_USERNAME` | `standard_user` | Username for the `standard` account |
| `E2E_PASSWORD` | `secret_sauce` | Password applied to all demo accounts |
| `PWHEADLESS` | `true` | Set to `false` for headed mode |

## Design decisions

**Typed locator constants over Page Object Model classes.** POM is appropriate in a large framework where pages have complex multi-step interactions that recur across many tests. For a framework at this scale, typed locator constant files solve the same maintenance problem, one change point per selector, without the class hierarchy. Composable fixtures handle shared setup. POM would add a class, a constructor, and a method for what is currently three lines of test code.

**Fixtures over shared `beforeEach` blocks.** The `loginAs` fixture is injected into each test that needs it rather than running in a `beforeEach` that applies to the whole suite. This keeps each test explicit about what state it requires and avoids hidden coupling between tests in the same describe block.

**Locators separate from specs.** When a selector changes in the application, one line changes in the locator file and all tests that reference it are fixed. If locators were inlined across spec files, the same change would require updates across every file that uses that selector.

**`@sanity` and `@regression` tags have distinct meanings.** A `@sanity` test verifies one thing: that a page rendered successfully end to end. That single assertion only passes if the app served the page, the login flow established a session, the page component executed without throwing, product data was fetched and mapped into the DOM, and the browser rendered it visibly. One assertion, the whole chain behind it. `@regression` tests cover interactions, edge cases, and error states. Both tags run independently, which matters in CI where a fast sanity pass can gate the full suite.

**E2E tests are written only for what unit tests cannot cover.** A test is justified at the E2E layer when it exercises a combination of real data, network, and browser rendering that a unit test cannot replicate. If the same behaviour can be verified faster and more precisely in isolation, it belongs in a unit test, not here.

## Example output

```
Running 18 tests using 6 workers

  ✓   1 [chromium] › specs/cart/cart.spec.ts:55:7 › Cart › continue shopping returns to inventory @regression (799ms)
  ✓   3 [chromium] › specs/cart/cart.spec.ts:28:7 › Cart › added items appear in cart with correct names @regression (797ms)
  ✓   2 [chromium] › specs/checkout/checkout.spec.ts:7:7 › Checkout › checkout flow completes with valid details @sanity (970ms)
  ✓   4 [chromium] › specs/cart/cart.spec.ts:43:7 › Cart › removing an item from cart updates badge count @regression (865ms)
  ✓   5 [chromium] › specs/cart/cart.spec.ts:6:7 › Cart › cart page renders after adding an item @sanity (752ms)
  ✓   6 [chromium] › specs/cart/cart.spec.ts:18:7 › Cart › cart badge count matches items added @regression (784ms)
  ✓   7 [chromium] › specs/checkout/checkout.spec.ts:33:7 › Checkout › checkout step one shows error when first name is missing @regression (805ms)
  ✓   8 [chromium] › specs/checkout/checkout.spec.ts:49:7 › Checkout › order overview shows item subtotal and tax @regression (889ms)
  ✓  10 [chromium] › specs/login/login.spec.ts:10:7 › Login › login page renders with username and password fields @sanity (728ms)
  ✓   9 [chromium] › specs/checkout/checkout.spec.ts:73:7 › Checkout › cancel from overview returns to cart @regression (960ms)
  ✓  11 [chromium] › specs/login/login.spec.ts:20:7 › Login › standard user logs in and reaches inventory page @sanity (762ms)
  ✓  12 [chromium] › specs/login/login.spec.ts:31:7 › Login › locked out user sees error message @regression (707ms)
  ✓  13 [chromium] › specs/login/login.spec.ts:43:7 › Login › empty credentials show error message @regression (666ms)
  ✓  14 [chromium] › specs/login/login.spec.ts:53:7 › Login › wrong password shows error message @regression (719ms)
  ✓  17 [chromium] › specs/products/products.spec.ts:38:7 › Product Catalog › sort by price low to high reorders the list @regression (695ms)
  ✓  16 [chromium] › specs/products/products.spec.ts:20:7 › Product Catalog › each product shows name and price @regression (712ms)
  ✓  15 [chromium] › specs/products/products.spec.ts:9:7 › Product Catalog › inventory page renders product list @sanity (775ms)
  ✓  18 [chromium] › specs/products/products.spec.ts:60:7 › Product Catalog › add to cart button changes to remove after clicking @regression (682ms)

  18 passed (3.4s)
```
