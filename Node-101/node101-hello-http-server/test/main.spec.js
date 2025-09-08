const { test, expect } = require('@playwright/test');

const url = 'http://localhost:8080';

test.describe('hello-express', () => {

  test('should have the correct page title', async ({ page }) => {
    await page.goto(url);
    const bodyText = await page.textContent('body');
    expect(bodyText.trim()).toBe('Hello, World!');
  });

  test('returns the correct status code', async ({ request }) => {
    const response = await request.get(url);
    expect(response.status()).toBe(200);
  });

});
