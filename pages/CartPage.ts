import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async openProduct(productName: string) {
    await this.item(productName)
      .locator('[data-test="inventory-item-name"]')
      .click();
  }

  async remove(productName: string) {
    await this.item(productName).getByRole("button", { name: "Remove" }).click();
  }
}
