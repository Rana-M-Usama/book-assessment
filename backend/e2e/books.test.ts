import { test, expect } from "@playwright/test";

test("should create and list books", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Click add book button
  await page.click('button:has-text("Add Book")');

  // Fill form
  await page.fill('input[name="title"]', "Test Book");
  await page.fill('input[name="author"]', "Test Author");
  await page.click('button:has-text("Save")');

  // Verify book appears in list
  await expect(page.locator("text=Test Book")).toBeVisible();
});

test("should handle pagination", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Create multiple books
  for (let i = 0; i < 3; i++) {
    await page.click('button:has-text("Add Book")');
    await page.fill('input[name="title"]', `Test Book ${i}`);
    await page.fill('input[name="author"]', `Test Author ${i}`);
    await page.click('button:has-text("Save")');
  }

  // Check pagination
  await expect(page.locator(".MuiPagination-root")).toBeVisible();

  // Test filters
  await page.fill('input[placeholder="Search title..."]', "Test Book 1");
  await expect(page.locator("text=Test Book 1")).toBeVisible();
  await expect(page.locator("text=Test Book 2")).not.toBeVisible();
});

test("should handle book deletion", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Create a book
  await page.click('button:has-text("Add Book")');
  await page.fill('input[name="title"]', "Delete Test");
  await page.fill('input[name="author"]', "Delete Author");
  await page.click('button:has-text("Save")');

  // Delete the book
  await page.click('button[aria-label="Delete book"]');
  await page.click('button:has-text("Confirm")');

  // Verify book is deleted
  await expect(page.locator("text=Delete Test")).not.toBeVisible();
});
