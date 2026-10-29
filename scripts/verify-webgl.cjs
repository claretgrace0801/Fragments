const { chromium } = require('playwright');
const fs = require('node:fs');

(async () => {
  const dir = `${__dirname}/results`;
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => requests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => { if (response.status() >= 400) requests.push({ url: response.url(), status: response.status() }); });
  try {
    const response = await page.goto('https://claretgrace0801.github.io/Fragments/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!response.ok()) throw new Error(`Game page returned ${response.status()}`);
    await page.waitForFunction(() => typeof unityInstance !== 'undefined', { timeout: 180000 });
    await page.waitForTimeout(10000);
    await page.screenshot({ path: `${dir}/menu.png` });
    // The game's menu is inside Unity's canvas, rather than the DOM.
    const canvas = page.locator('#unity-canvas');
    await canvas.click({ position: { x: 640, y: 330 } });
    await page.waitForTimeout(20000);
    await page.screenshot({ path: `${dir}/after-click.png` });
  } catch (error) {
    errors.push(error.stack);
    await page.screenshot({ path: `${dir}/failure.png` }).catch(() => {});
  } finally {
    fs.writeFileSync(`${dir}/report.json`, JSON.stringify({ errors, requests }, null, 2));
    await browser.close();
  }
  if (errors.length || requests.length) {
    console.error(JSON.stringify({ errors, requests }, null, 2));
    process.exitCode = 1;
  }
})();
