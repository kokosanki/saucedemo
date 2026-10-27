import { Page, Locator } from "@playwright/test";

export class ProductDetailsPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('[data-test="inventory-item-name"]');
    this.price = page.locator('[data-test="inventory-item-price"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }
}
