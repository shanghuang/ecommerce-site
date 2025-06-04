// playwright/e2e/register.spec.ts
import { test, expect } from '@playwright/test';
import { validCredentials, invalidCredentials } from './test_data';

test('Register page works', async ({ page }) => {
  // Navigate to register page
  await page.goto('/register');

  // Fill form
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', validCredentials.email);
  await page.fill('input[name="password"]', validCredentials.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation to home page
  await page.waitForURL('/login');

  // Assert success
  await expect(page).toHaveURL('/login');
});

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
  //await expect(page).toHaveURL('/');

  // Verify token is stored in localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeDefined();

  // Verify email is stored in localStorage
  const storedEmail = await page.evaluate(() => localStorage.getItem('email'));
  expect(storedEmail).toBe(validCredentials.email);
});


test('Successful unregistration redirects to home page', async ({ page }) => {
  // Navigate to unregister page
  await page.goto('/unregister');

  // Fill form with valid password
  await page.fill('input[id="password"]', validCredentials.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation to home page
  await page.waitForURL('/');

  // Verify redirect
  //await expect(page).toHaveURL('/');

  // Verify token and email are cleared from localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeNull();

  const email = await page.evaluate(() => localStorage.getItem('email'));
  expect(email).toBeNull();
});

test('Invalid password shows error message', async ({ page }) => {
  // Navigate to unregister page
  await page.goto('/unregister');

  // Fill form with invalid password
  await page.fill('input[id="password"]', invalidPassword);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for error message to appear
  await page.waitForSelector('div.bg-red-100');

  // Verify error message is displayed
  const errorMessage = await page.textContent('div.bg-red-100');
  expect(errorMessage).toContain('Invalid password'); // Update with your actual error message

  // Verify no redirect occurred
  await expect(page).toHaveURL('/unregister');
});