import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA_DIR = "C:\\Users\\mohan\\AppData\\Local\\Temp\\chrome_bluorng_inspector_pdp";
const SCREENSHOT_DIR = path.resolve('inspector/screenshots');
const DATA_DIR = path.resolve('inspector/data');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  console.log('=== INSPECTING PDPs 2-5 & FOOTER ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${USER_DATA_DIR}`
    ]
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(30000);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  const products = [
    { handle: 'black-ragnarok-t-shirt', name: 'Black Ragnarok T-Shirt', num: 2 },
    { handle: 'thunderstruck-hoodie', name: 'Thunderstruck Hoodie', num: 3 },
    { handle: 'mothra-rising-t-shirt', name: 'Mothra Rising T-Shirt', num: 4 },
    { handle: 'black-ripstop-cargos', name: 'Black Ripstop Cargos', num: 5 }
  ];

  const pdpData = [];

  for (const prod of products) {
    const url = `https://bluorng.com/products/${prod.handle}`;
    console.log(`Inspecting PDP ${prod.num}/5: ${prod.name}...`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await sleep(3000);

      const shotPath = path.join(SCREENSHOT_DIR, `05_pdp_${prod.num}_${prod.handle}_desktop.png`);
      await page.screenshot({ path: shotPath });
      console.log(`  Saved screenshot: ${shotPath}`);

      const info = await page.evaluate((p) => {
        const title = document.querySelector('h1, [class*="product__title"]')?.innerText?.trim();
        const price = document.querySelector('[class*="price--on-sale"], [class*="price__regular"], [class*="price"]')?.innerText?.trim();
        const desc = document.querySelector('[class*="description"]')?.innerText?.slice(0, 200);
        const images = Array.from(document.querySelectorAll('[class*="product"] img, [class*="gallery"] img')).map(img => img.src).filter(Boolean).slice(0, 5);
        const sizes = Array.from(document.querySelectorAll('input[name*="Size" i] + label, fieldset label, [class*="size"] label')).map(l => l.innerText?.trim()).filter(Boolean);
        return { prod: p, title, price, desc, images, sizes };
      }, prod);

      pdpData.push(info);
    } catch (err) {
      console.warn(`  Warning on PDP ${prod.num}:`, err.message);
    }
  }

  // Footer & Policy
  console.log('Inspecting Policy Page & Footer...');
  try {
    await page.goto('https://bluorng.com/policies/terms-of-service', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await sleep(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_policy_terms_desktop.png') });
  } catch(e) {}

  fs.writeFileSync(path.join(DATA_DIR, '04_pdp_inspections_part2.json'), JSON.stringify(pdpData, null, 2));

  await browser.close();
  console.log('=== PDPs & FOOTER INSPECTION COMPLETED! ===');
}

run().catch(console.error);
