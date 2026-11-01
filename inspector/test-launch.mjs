import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function test() {
  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=C:\\Users\\mohan\\AppData\\Local\\Temp\\chrome_inspect_test_p'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  console.log('Navigating to https://bluorng.com ...');
  await page.goto('https://bluorng.com', { waitUntil: 'domcontentloaded', timeout: 45000 });
  console.log('Page loaded! Title:', await page.title());
  
  await page.screenshot({ path: 'inspector/screenshots/test_desktop.png' });
  console.log('Screenshot saved to inspector/screenshots/test_desktop.png');
  
  await browser.close();
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
