import dotenv from "dotenv";
dotenv.config();
import { test, expect } from "@playwright/test";

test("login with Cognito", async ({ page }) => {
  await page.goto("/login");

  await page.fill("#email", process.env.TEST_USER_EMAIL!);
  await page.fill("#password", process.env.TEST_USER_PASSWORD!);

  await page.click("button[type='submit']");

  try {
    await expect(page).toHaveURL("/", { timeout: 8000 });
  } catch (err) {
    await page.screenshot({
      path: "test-artifacts/login-failure.png",
      fullPage: true,
    });
    throw err;
  }
  
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
});
