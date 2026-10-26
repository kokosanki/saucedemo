import { test, expect } from "@playwright/test";
import { credentials } from "../config";
import { LoginPage } from "../pages/LoginPage";

const wrongPassword = "wrong_password";

const invalidLogins = [
  {
    name: "locked out user",
    username: credentials.lockedOutUser,
    password: credentials.password,
    error: "Epic sadface: Sorry, this user has been locked out.",
  },
  {
    name: "user with wrong password",
    username: credentials.standardUser,
    password: wrongPassword,
    error:
      "Epic sadface: Username and password do not match any user in this service",
  },
  {
    name: "user with empty username",
    username: "",
    password: credentials.password,
    error: "Epic sadface: Username is required",
  },
  {
    name: "user with empty password",
    username: credentials.standardUser,
    password: "",
    error: "Epic sadface: Password is required",
  },
];

test("standard user can log in", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(credentials.standardUser, credentials.password);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('[data-test="title"]')).toHaveText("Products");
});

for (const { name, username, password, error } of invalidLogins) {
  test(`${name} cannot log in`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.errorMessage).toHaveText(error);
  });
}
