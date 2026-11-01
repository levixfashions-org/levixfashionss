import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA_DIR = "C:\\Users\\mohan\\AppData\\Local\\Temp\\chrome_bluorng_inspector";
const SCREENSHOT_DIR = path.resolve('inspector/screenshots');
const DATA_DIR = path.resolve('inspector/data');

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function safeGoto(page, url, waitMs = 3000) {
  console.log(`  Navigating to: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
  } catch (err) {
    console.warn(`  Warning during goto (${url}):`, err.message);
  }
  await sleep(waitMs);
}

async function run() {
  console.log('=== BLUORNG REVERSE ENGINEERING AUTOMATED SUITE (RESILIENT) ===');
  console.log('Launching Headless Chrome instance with remote CDP...');
  
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
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
  
  // Track network assets (fonts, stylesheets, APIs)
  const networkAssets = { fonts: [], stylesheets: [], apis: [], images: [] };
  page.on('response', async res => {
    try {
      const url = res.url();
      const type = res.request().resourceType();
      if (type === 'font') networkAssets.fonts.push(url);
      if (type === 'stylesheet') networkAssets.stylesheets.push(url);
      if (type === 'fetch' || type === 'xhr') networkAssets.apis.push(url);
    } catch(e) {}
  });

  // ==========================================
  // 1. HOMEPAGE DESKTOP
  // ==========================================
  console.log('\n[1/7] Inspecting Homepage (Desktop 1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await safeGoto(page, 'https://bluorng.com', 4000);

  // Close modals/popups
  try {
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button, a, [role="button"], .popup-close, .modal-close'));
      for (const btn of closeButtons) {
        const text = btn.innerText?.toLowerCase() || '';
        const aria = btn.getAttribute('aria-label')?.toLowerCase() || '';
        if (text.includes('close') || text.includes('✕') || text.includes('×') || aria.includes('close')) {
          btn.click();
        }
      }
    });
  } catch (e) {}

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_homepage_desktop_above_fold.png') });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_homepage_desktop_fullpage.png'), fullPage: true });
  console.log('  Saved desktop homepage screenshots.');

  // Extract Global & Section Tokens
  const homepageTokens = await page.evaluate(() => {
    const getElStyles = (el) => {
      if (!el) return null;
      const c = window.getComputedStyle(el);
      return {
        fontFamily: c.fontFamily,
        fontSize: c.fontSize,
        fontWeight: c.fontWeight,
        lineHeight: c.lineHeight,
        letterSpacing: c.letterSpacing,
        textTransform: c.textTransform,
        color: c.color,
        backgroundColor: c.backgroundColor,
        padding: c.padding,
        margin: c.margin,
        border: c.border,
        borderRadius: c.borderRadius
      };
    };

    const fontFaces = [];
    document.fonts.forEach(f => {
      fontFaces.push({ family: f.family, weight: f.weight, style: f.style, status: f.status });
    });

    const sections = Array.from(document.querySelectorAll('section, main > div, header, footer')).map((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const headings = Array.from(sec.querySelectorAll('h1, h2, h3, h4, .heading, [class*="title"]')).map(h => ({
        tag: h.tagName,
        text: h.innerText?.trim().slice(0, 80),
        styles: getElStyles(h)
      }));
      const images = Array.from(sec.querySelectorAll('img')).map(img => ({
        src: img.src || img.dataset.src,
        alt: img.alt,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        aspectRatio: (img.naturalWidth && img.naturalHeight) ? (img.naturalWidth / img.naturalHeight).toFixed(2) : null
      }));
      const links = Array.from(sec.querySelectorAll('a')).slice(0, 10).map(a => ({
        text: a.innerText?.trim().slice(0, 50),
        href: a.href
      }));

      return {
        index: idx,
        tagName: sec.tagName,
        id: sec.id,
        className: sec.className,
        dimensions: { width: Math.round(rect.width), height: Math.round(rect.height) },
        headings,
        imageCount: images.length,
        sampleImages: images.slice(0, 4),
        sampleLinks: links
      };
    });

    const header = document.querySelector('header');
    const announcement = document.querySelector('[class*="announcement"], [id*="announcement"]');
    const logo = document.querySelector('header img, header svg, [class*="logo"]');

    return {
      title: document.title,
      bodyStyles: getElStyles(document.body),
      announcementBar: announcement ? { text: announcement.innerText?.trim(), styles: getElStyles(announcement) } : null,
      headerStyles: getElStyles(header),
      logo: logo ? { tagName: logo.tagName, src: logo.src || null, rect: logo.getBoundingClientRect() } : null,
      fontFaces,
      sections
    };
  });

  fs.writeFileSync(path.join(DATA_DIR, '01_homepage_tokens.json'), JSON.stringify(homepageTokens, null, 2));
  console.log('  Extracted homepage sections and tokens.');

  // ==========================================
  // 2. HOMEPAGE MOBILE
  // ==========================================
  console.log('\n[2/7] Inspecting Homepage (Mobile 390x844 iPhone 14)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await safeGoto(page, 'https://bluorng.com', 3000);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_homepage_mobile_above_fold.png') });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_homepage_mobile_fullpage.png'), fullPage: true });

  try {
    const hamburger = await page.$('button[aria-label*="menu" i], [class*="hamburger" i], [class*="menu-trigger" i], header button');
    if (hamburger) {
      await hamburger.click();
      await sleep(1500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_homepage_mobile_nav_drawer.png') });
      console.log('  Captured mobile navigation drawer.');
    }
  } catch (e) {
    console.log('  Mobile menu drawer click skipped:', e.message);
  }

  // ==========================================
  // 3. DESKTOP NAVIGATION, MEGA MENUS, SEARCH & CART
  // ==========================================
  console.log('\n[3/7] Inspecting Desktop Navigation, Cart Drawer & Search...');
  await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
  await safeGoto(page, 'https://bluorng.com', 3000);

  const navInspection = await page.evaluate(() => {
    const navItems = Array.from(document.querySelectorAll('header nav a, header [role="navigation"] a, header ul li a')).map(a => ({
      text: a.innerText?.trim(),
      href: a.href,
      styles: {
        fontFamily: window.getComputedStyle(a).fontFamily,
        fontSize: window.getComputedStyle(a).fontSize,
        fontWeight: window.getComputedStyle(a).fontWeight,
        letterSpacing: window.getComputedStyle(a).letterSpacing,
        textTransform: window.getComputedStyle(a).textTransform,
        color: window.getComputedStyle(a).color
      }
    }));
    return { navItems };
  });
  fs.writeFileSync(path.join(DATA_DIR, '02_navigation_inspection.json'), JSON.stringify(navInspection, null, 2));

  try {
    const topNavLinks = await page.$$('header nav a, header ul li');
    if (topNavLinks.length > 1) {
      await topNavLinks[1].hover();
      await sleep(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_nav_hover.png') });
    }
  } catch (e) {}

  try {
    const searchTrigger = await page.$('a[href*="/search"], button[aria-label*="search" i], [class*="search-toggle"], [class*="search-icon"]');
    if (searchTrigger) {
      await searchTrigger.click();
      await sleep(1500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_search_modal.png') });
      console.log('  Captured search modal/drawer.');
    }
  } catch (e) {}

  // Cart drawer
  try {
    await safeGoto(page, 'https://bluorng.com', 2000);
    const cartTrigger = await page.$('a[href*="/cart"], button[aria-label*="cart" i], [class*="cart-drawer-toggle"], [class*="header__cart"]');
    if (cartTrigger) {
      await cartTrigger.click();
      await sleep(2000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_cart_drawer_empty.png') });
      console.log('  Captured cart drawer.');
    }
  } catch (e) {}

  // ==========================================
  // 4. COLLECTION PAGE INSPECTION
  // ==========================================
  console.log('\n[4/7] Inspecting Collection Page (/collections/bluorng-x-godzilla)...');
  await safeGoto(page, 'https://bluorng.com/collections/bluorng-x-godzilla', 3000);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_collection_desktop_fullpage.png'), fullPage: true });

  const collectionData = await page.evaluate(() => {
    const title = document.querySelector('h1')?.innerText?.trim();
    const productCards = Array.from(document.querySelectorAll('[class*="product-card"], [class*="product-grid-item"], [class*="grid__item"]')).slice(0, 8).map(card => {
      const titleEl = card.querySelector('[class*="title"], h2, h3, a');
      const priceEl = card.querySelector('[class*="price"]');
      const badgeEl = card.querySelector('[class*="badge"], [class*="tag"], [class*="label"]');
      const img = card.querySelector('img');
      const cTitle = titleEl ? window.getComputedStyle(titleEl) : null;
      const cPrice = priceEl ? window.getComputedStyle(priceEl) : null;

      return {
        title: titleEl?.innerText?.trim(),
        price: priceEl?.innerText?.trim(),
        badge: badgeEl?.innerText?.trim(),
        imgSrc: img?.src,
        dimensions: { width: card.clientWidth, height: card.clientHeight },
        titleStyles: cTitle ? {
          fontFamily: cTitle.fontFamily,
          fontSize: cTitle.fontSize,
          fontWeight: cTitle.fontWeight,
          color: cTitle.color
        } : null,
        priceStyles: cPrice ? {
          fontFamily: cPrice.fontFamily,
          fontSize: cPrice.fontSize,
          fontWeight: cPrice.fontWeight,
          color: cPrice.color
        } : null
      };
    });

    const filters = Array.from(document.querySelectorAll('[class*="filter"], [id*="filter"] button, [id*="filter"] summary')).map(f => f.innerText?.trim());
    return { title, productCardsCount: productCards.length, sampleCards: productCards, filters: filters.slice(0, 10) };
  });

  fs.writeFileSync(path.join(DATA_DIR, '03_collection_inspection.json'), JSON.stringify(collectionData, null, 2));
  console.log('  Extracted collection page structure.');

  // ==========================================
  // 5. FIVE PRODUCT DETAIL PAGES (PDPs)
  // ==========================================
  console.log('\n[5/7] Inspecting 5 Distinct Product Detail Pages (PDPs)...');
  const products = [
    { handle: 'cherry-blossom-polo-t-shirt', name: 'Cherry Blossom Polo T-Shirt', category: 'Polo / T-Shirt' },
    { handle: 'black-ragnarok-t-shirt', name: 'Black Ragnarok T-Shirt', category: 'Graphic Tee' },
    { handle: 'thunderstruck-hoodie', name: 'Thunderstruck Hoodie', category: 'Heavyweight Hoodie' },
    { handle: 'mothra-rising-t-shirt', name: 'Mothra Rising T-Shirt', category: 'Collab Special Tee' },
    { handle: 'black-ripstop-cargos', name: 'Black Ripstop Cargos', category: 'Technical Cargo Bottoms' }
  ];

  const pdpInspections = [];

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const url = `https://bluorng.com/products/${prod.handle}`;
    console.log(`  Inspecting PDP ${i + 1}/5: ${prod.name} (${url})...`);

    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    await safeGoto(page, url, 3000);

    const desktopPdpScreenshot = `05_pdp_${i + 1}_${prod.handle}_desktop.png`;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, desktopPdpScreenshot) });

    const details = await page.evaluate((prodMeta) => {
      const getStyles = (el) => {
        if (!el) return null;
        const c = window.getComputedStyle(el);
        return {
          fontFamily: c.fontFamily,
          fontSize: c.fontSize,
          fontWeight: c.fontWeight,
          lineHeight: c.lineHeight,
          letterSpacing: c.letterSpacing,
          color: c.color,
          backgroundColor: c.backgroundColor,
          border: c.border,
          borderRadius: c.borderRadius,
          padding: c.padding
        };
      };

      const titleEl = document.querySelector('h1, [class*="product__title"], [class*="product-title"]');
      const priceEl = document.querySelector('[class*="price--on-sale"], [class*="price__regular"], [class*="product-price"], [class*="price"]');
      const comparePriceEl = document.querySelector('[class*="price--compare"], [class*="compare-at-price"], s');
      const descEl = document.querySelector('[class*="product__description"], [class*="description"], [id*="description"]');
      const atcBtn = document.querySelector('button[name="add"], [class*="add-to-cart"], button[type="submit"]');

      const sizeOptions = Array.from(document.querySelectorAll('input[name*="Size" i] + label, [data-option-name*="Size" i] button, fieldset label, [class*="size-pill"], [class*="size-selector"] label')).map(btn => ({
        text: btn.innerText?.trim(),
        styles: getStyles(btn)
      }));

      const galleryImgs = Array.from(document.querySelectorAll('[class*="product__media"] img, [class*="gallery"] img, [class*="product-single__photo"] img, [class*="slider"] img')).map(img => ({
        src: img.src || img.dataset.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: (img.naturalWidth && img.naturalHeight) ? (img.naturalWidth / img.naturalHeight).toFixed(2) : null
      }));

      const tabs = Array.from(document.querySelectorAll('details, [class*="accordion"], [class*="tab"] summary, [class*="tab"] button')).map(t => t.innerText?.trim());

      return {
        meta: prodMeta,
        title: titleEl?.innerText?.trim(),
        titleStyles: getStyles(titleEl),
        price: priceEl?.innerText?.trim(),
        priceStyles: getStyles(priceEl),
        comparePrice: comparePriceEl?.innerText?.trim(),
        atcButton: atcBtn ? {
          text: atcBtn.innerText?.trim(),
          styles: getStyles(atcBtn)
        } : null,
        sizeOptions,
        galleryImages: galleryImgs.slice(0, 8),
        tabs: tabs.slice(0, 6),
        descriptionSnippet: descEl?.innerText?.slice(0, 300)
      };
    }, prod);

    if (i === 0 || i === 4) {
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await sleep(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `05_pdp_${i + 1}_${prod.handle}_mobile.png`) });
    }

    pdpInspections.push(details);
  }

  fs.writeFileSync(path.join(DATA_DIR, '04_pdp_inspections.json'), JSON.stringify(pdpInspections, null, 2));
  console.log('  Extracted 5 complete PDPs.');

  // ==========================================
  // 6. FOOTER & INFORMATIONAL PAGES
  // ==========================================
  console.log('\n[6/7] Inspecting Footer & Policy Pages...');
  await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
  await safeGoto(page, 'https://bluorng.com/policies/terms-of-service', 3000);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_policy_terms_desktop.png') });

  const footerInspection = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    const computed = window.getComputedStyle(footer);
    const columns = Array.from(footer.querySelectorAll('[class*="col"], [class*="grid__item"], [class*="block"]')).map(col => {
      const heading = col.querySelector('h2, h3, h4, h5, p[class*="heading"]')?.innerText?.trim();
      const links = Array.from(col.querySelectorAll('a')).map(a => ({ text: a.innerText?.trim(), href: a.href }));
      return { heading, links };
    });

    const newsletter = footer.querySelector('form, [class*="newsletter"]');
    const paymentIcons = Array.from(footer.querySelectorAll('svg, [class*="payment"] img')).map(el => el.getAttribute('aria-label') || el.className || 'icon');

    return {
      styles: {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        padding: computed.padding,
        fontFamily: computed.fontFamily
      },
      columns,
      newsletterPresent: !!newsletter,
      paymentIconsCount: paymentIcons.length,
      copyright: footer.querySelector('[class*="copyright"], small')?.innerText?.trim()
    };
  });

  fs.writeFileSync(path.join(DATA_DIR, '05_footer_inspection.json'), JSON.stringify(footerInspection, null, 2));
  console.log('  Extracted footer and informational page tokens.');

  // ==========================================
  // 7. SUMMARY DESIGN SYSTEM TOKENS
  // ==========================================
  console.log('\n[7/7] Consolidating Design System Tokens...');
  const designTokens = {
    capturedAt: new Date().toISOString(),
    sourceUrl: 'https://bluorng.com',
    browserEngine: 'Google Chrome / HeadlessChrome CDP',
    homepage: homepageTokens,
    navigation: navInspection,
    collection: collectionData,
    products: pdpInspections,
    footer: footerInspection,
    assetsCaptured: {
      fontsCount: networkAssets.fonts.length,
      uniqueFonts: [...new Set(networkAssets.fonts)],
      stylesheetsCount: networkAssets.stylesheets.length,
      apisCount: networkAssets.apis.length
    }
  };

  fs.writeFileSync(path.join(DATA_DIR, 'design_tokens_master.json'), JSON.stringify(designTokens, null, 2));

  await browser.close();
  console.log('\n=== REVERSE ENGINEERING SUITE FINISHED SUCCESSFULLY! ===');
  console.log(`Saved all screenshots in: ${SCREENSHOT_DIR}`);
  console.log(`Saved all JSON tokens in: ${DATA_DIR}`);
}

run().catch(err => {
  console.error('Fatal inspection error:', err);
  process.exit(1);
});
