import { test, expect } from "@playwright/test";
import { credentials } from "../config";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { invalidLogins } from "../data/logins";

test.describe("login", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
  });

  test("standard user can log in", async ({ page }) => {
    await loginPage.login(credentials.standardUser, credentials.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText("Products");
  });

  for (const { name, username, password, error } of invalidLogins) {
    test(`${name} cannot log in`, async ({ page }) => {
      await loginPage.login(username, password);

      await expect(page).not.toHaveURL(/inventory\.html/);
      await expect(loginPage.errorMessage).toHaveText(error);
    });
  }
});
