// tests/ui/login.spec.ts
import { test, expect } from '@playwright/test';
import { validCredentials, invalidCredentials } from './test_data';


test('Successful login redirects to home page', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');

  // Fill form with valid credentials
  await page.fill('input[id="email"]', validCredentials.email);
  await page.fill('input[id="password"]', validCredentials.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation to home page
  await page.waitForURL('/');

  // Verify redirect
  await expect(page).toHaveURL('/');

  // Verify token is stored in localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeDefined();

  // Verify email is stored in localStorage
  const storedEmail = await page.evaluate(() => localStorage.getItem('email'));
  expect(storedEmail).toBe(validCredentials.email);
});

test('Invalid login shows error message', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');

  // Fill form with invalid credentials
  await page.fill('input[id="email"]', invalidCredentials.email);
  await page.fill('input[id="password"]', invalidCredentials.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for error message to appear
  await page.waitForSelector('div.bg-red-100');

  // Verify error message is displayed
  const errorMessage = await page.textContent('div.bg-red-100');
  expect(errorMessage).toContain('Invalid credentials'); // Update with your actual error message

  // Verify no redirect occurred
  await expect(page).toHaveURL('/login');
});