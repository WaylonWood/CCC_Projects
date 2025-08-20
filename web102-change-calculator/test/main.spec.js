const { test, expect } = require('@playwright/test');
const http = require('http');
const nodeStatic = require('node-static');

const PORT = 8888;
const url = `http://localhost:${PORT}/index.html`;

let server;

test.setTimeout(5000);

test.beforeAll(async () => {
  const fileServer = new nodeStatic.Server('./', { cache: 0 });
  server = http.createServer((req, res) => {
    req.addListener('end', () => {
      fileServer.serve(req, res);
    }).resume();
  });

  await new Promise(resolve => server.listen(PORT, resolve));
});

test.afterAll(() => {
  server.close();
});


test.describe('Server Setup', () => {
  test('should load successfully', async ({ request }) => {
    const response = await request.get(url);
    expect(response.status()).toBe(200);
  });
});

test.describe('HTML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('should have an H1 with the text "Change Calculator"', async ({ page }) => {
    const heading = await page.locator('h1').textContent();
    expect(heading).toBe('Change Calculator');
  });

  test('should have an input with id="amount-due"', async ({ page }) => {
    await expect(page.locator('input#amount-due')).toHaveCount(1);
  });
  
  test('should have an input with id="amount-received"', async ({ page }) => {
    await expect(page.locator('input#amount-received')).toHaveCount(1);
  });
  
  test('should have a button with id="calculate-change"', async ({ page }) => {
    await expect(page.locator('button#calculate-change')).toHaveCount(1);
  });

  const outputIds = [
    'dollars-output',
    'quarters-output',
    'dimes-output',
    'nickels-output',
    'pennies-output'
  ];
  
  for (const id of outputIds) {
    test(`should have a <p> tag with id="${id}"`, async ({ page }) => {
      const element = page.locator(`p#${id}`);
      await expect(element).toHaveCount(1);
    });
  }

  test('should allow typing into #amount-due', async ({ page }) => {
    await page.fill('#amount-due', '12.34');
    const value = await page.locator('#amount-due').inputValue();
    expect(value).toBe('12.34');
  });

  test('should allow typing into #amount-received', async ({ page }) => {
    await page.fill('#amount-received', '20');
    const value = await page.locator('#amount-received').inputValue();
    expect(value).toBe('20');
  });

  test('should trigger calculation when #calculate-change is clicked', async ({ page }) => {
    await page.fill('#amount-due', '10');
    await page.fill('#amount-received', '20');
    await page.click('#calculate-change');

    const dollars = await page.locator('#dollars-output').textContent();
    expect(dollars).toBe('10');
  });
});

test.describe('Integration', () => {
  const scenarios = [
    {
      due: '10.21',
      received: '20',
      expected: {
        dollars: '9',
        quarters: '3',
        dimes: '0',
        nickels: '0',
        pennies: '4',
      },
    },
    {
      due: '13.34',
      received: '20',
      expected: {
        dollars: '6',
        quarters: '2',
        dimes: '1',
        nickels: '1',
        pennies: '1',
      },
    }
  ];

  for (const { due, received, expected } of scenarios) {
    test(`should display correct change for $${received} received, $${due} due`, async ({ page }) => {
      await page.goto(url);
      await page.fill('#amount-received', received);
      await page.fill('#amount-due', due);
      await page.click('#calculate-change');

      for (const [key, value] of Object.entries(expected)) {
        const text = await page.locator(`#${key}-output`).textContent();
        expect(text).toBe(value);
      }
    });
  }
});
