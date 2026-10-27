import { test, expect } from "@playwright/test";
import { credentials } from "../config";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { backpack, bikeLight, products } from "../data/products";
import { messages } from "../data/messages";

test.describe("cart when logged in", () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    productDetailsPage = new ProductDetailsPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.standardUser, credentials.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test("cart is empty for a new session", async () => {
    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText("Your Cart");
    await expect(cartPage.items).toHaveCount(0);
  });

  for (const { name, price } of products) {
    test(`${name} appears in the cart after adding it`, async () => {
      await inventoryPage.addToCart(name);
      await inventoryPage.openCart();

      await expect(cartPage.items).toHaveCount(1);
      await expect(cartPage.item(name)).toContainText(price);
      await expect(cartPage.quantityOf(name)).toHaveText("1");
    });
  }

  test("cart badge shows the number of added products", async () => {
    await inventoryPage.addToCart(backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText("1");

    await inventoryPage.addToCart(bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText("2");
  });

  test("multiple added products are all listed in the cart", async () => {
    await inventoryPage.addToCart(backpack.name, bikeLight.name);
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.item(backpack.name)).toBeVisible();
    await expect(cartPage.item(bikeLight.name)).toBeVisible();
  });

  test("cart badge is hidden after removing a product on the products page", async () => {
    await inventoryPage.addToCart(backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText("1");

    await inventoryPage.removeFromCart(backpack.name);

    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test("cart keeps the other product after removing one in the cart", async () => {
    await inventoryPage.addToCart(backpack.name, bikeLight.name);
    await inventoryPage.openCart();

    await cartPage.remove(backpack.name);

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.item(backpack.name)).toHaveCount(0);
    await expect(cartPage.item(bikeLight.name)).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  test("cart is empty after removing the last product", async () => {
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.openCart();

    await cartPage.remove(backpack.name);

    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test("cart contents survive a page reload", async ({ page }) => {
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.openCart();

    await page.reload();

    await expect(cartPage.item(backpack.name)).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  test("continue shopping returns to the products page", async ({ page }) => {
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.openCart();

    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  test("product name in the cart opens the details of the same product", async ({
    page,
  }) => {
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.openCart();

    await cartPage.openProduct(backpack.name);

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(productDetailsPage.name).toHaveText(backpack.name);
    await expect(productDetailsPage.price).toHaveText(backpack.price);
  });

  test("checkout moves on to the checkout form", async ({ page }) => {
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.openCart();

    await cartPage.checkoutButton.click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});

test.describe("cart when logged out", () => {
  test("cart is not accessible without logging in", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto("/cart.html");

    await expect(page).toHaveURL("/");
    await expect(loginPage.errorMessage).toHaveText(messages.cartRequiresLogin);
  });
});

