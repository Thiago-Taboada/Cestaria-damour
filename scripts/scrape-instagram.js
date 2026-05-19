const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const HANDLE = 'cestaria.damour';
const OUT_DIR = path.join(__dirname, '..', 'assets', 'instagram');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
    }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'pt-BR',
  });

  const url = `https://www.instagram.com/${HANDLE}/`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Scroll to load grid
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
  }

  const data = await page.evaluate(() => {
    const getMeta = (prop) => {
      const el = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
      return el ? el.getAttribute('content') : null;
    };

    const ogTitle = getMeta('og:title');
    const ogDesc = getMeta('og:description');
    const ogImage = getMeta('og:image');

    // Parse description: "X Followers, Y Following, Z Posts - bio"
    let followers = null, following = null, posts = null, bio = ogDesc || '';
    const m = (ogDesc || '').match(/([\d,.KkMm]+)\s*Followers?,\s*([\d,.KkMm]+)\s*Following,\s*([\d,.KkMm]+)\s*Posts?\s*-?\s*(.*)/i);
    if (m) {
      followers = m[1]; following = m[2]; posts = m[3]; bio = m[4].trim();
    }

    // Collect post images from grid
    const imgs = [];
    document.querySelectorAll('img').forEach((img) => {
      const src = img.src || img.getAttribute('srcset')?.split(' ')[0];
      if (!src || src.includes('data:')) return;
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      if (w < 100 && h < 100) return;
      if (src.includes('profile') || src.includes('150x150') || src.includes('44x44')) return;
      if (!imgs.includes(src)) imgs.push(src);
    });

    // External link in bio area
    let externalLink = null;
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.href;
      if (href && !href.includes('instagram.com') && href.startsWith('http')) {
        externalLink = href;
      }
    });

    return { ogTitle, ogDesc, ogImage, followers, following, posts, bio, imgs: imgs.slice(0, 12), externalLink };
  });

  // Try to get more from visible text
  const pageText = await page.innerText('body').catch(() => '');
  
  await browser.close();

  const result = { handle: HANDLE, ...data, pageTextSnippet: pageText.slice(0, 2000) };

  // Download profile pic
  if (data.ogImage) {
    try {
      await downloadFile(data.ogImage, path.join(OUT_DIR, 'profile.jpg'));
      result.profileSaved = 'profile.jpg';
    } catch (e) {
      result.profileError = e.message;
    }
  }

  // Download post images
  result.postsSaved = [];
  for (let i = 0; i < data.imgs.length; i++) {
    const ext = data.imgs[i].includes('.png') ? 'png' : 'jpg';
    const fname = `post-${i + 1}.${ext}`;
    try {
      await downloadFile(data.imgs[i], path.join(OUT_DIR, fname));
      result.postsSaved.push(fname);
    } catch (e) {
      result.postsSaved.push({ error: fname, msg: e.message });
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'profile-data.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
})();
