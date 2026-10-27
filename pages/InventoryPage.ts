import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  private slug(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, "-");
  }

  async addToCart(...productNames: string[]) {
    for (const productName of productNames) {
      await this.page
        .locator(`[data-test="add-to-cart-${this.slug(productName)}"]`)
        .click();
    }
  }

  async removeFromCart(productName: string) {
    await this.page
      .locator(`[data-test="remove-${this.slug(productName)}"]`)
      .click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
