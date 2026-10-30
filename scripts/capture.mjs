import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const baseUrl = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4173/'
const outputDirectory = new URL('../docs/screenshots/', import.meta.url)
const outputPath = (filename) => fileURLToPath(new URL(filename, outputDirectory))

await mkdir(outputDirectory, { recursive: true })
const browser = await chromium.launch()

async function prepare(page, url = baseUrl) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(450)
  await page.addStyleTag({ content: '.content-section, .contact-section { content-visibility: visible !important; } .reveal-target { opacity: 1 !important; transform: none !important; transition: none !important; } .route-shell { animation: none !important; }' })
  await page.evaluate(() => window.scrollTo(0, 0))
}

async function captureViewport(width, height, filename, options = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await prepare(page, options.url ?? baseUrl)
  if (options.dark) {
    await page.evaluate(() => localStorage.setItem('portfolio-theme', 'dark'))
    await page.reload({ waitUntil: 'networkidle' })
    await page.addStyleTag({ content: '.reveal-target { opacity: 1 !important; transform: none !important; transition: none !important; }' })
  }
  await page.screenshot({ path: outputPath(filename), fullPage: Boolean(options.fullPage) })
  await page.close()
}

async function captureSection(page, selector, filename) {
  const headerStyle = await page.addStyleTag({ content: '.site-header, .skip-link, .back-to-top { visibility: hidden !important; }' })
  await page.locator(selector).screenshot({ path: outputPath(filename) })
  await headerStyle.evaluate((element) => element.remove())
}

const homeViewports = [
  [320, 720, 'home-320.png'],
  [360, 800, 'home-360.png'],
  [390, 844, 'home-390.png'],
  [430, 932, 'home-430.png'],
  [768, 1024, 'home-tablet-768.png'],
  [820, 1180, 'home-tablet-820.png'],
  [1024, 900, 'home-desktop-1024.png'],
  [1440, 1000, 'home-desktop-1440.png'],
  [1920, 1080, 'home-desktop-1920.png'],
  [844, 390, 'home-landscape-844.png'],
  [932, 430, 'home-landscape-932.png'],
]

for (const [width, height, filename] of homeViewports) await captureViewport(width, height, filename)

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await prepare(mobile)
await captureSection(mobile, '.hero', 'hero-mobile.png')
await captureSection(mobile, '#experience', 'experience-mobile.png')
await captureSection(mobile, '#autismoconecta-case-study', 'autismoconecta-case-study-mobile.png')
await captureSection(mobile, '#skills', 'skills-mobile.png')
await captureSection(mobile, '#contact', 'contact-mobile.png')

await prepare(mobile, `${baseUrl}#/projects`)
await mobile.screenshot({ path: outputPath('projects-mobile.png'), fullPage: true })
await prepare(mobile, `${baseUrl}#/projects/engineering-portfolio-delivery`)
await mobile.screenshot({ path: outputPath('project-detail-mobile.png'), fullPage: true })
await prepare(mobile, `${baseUrl}#/resume`)
await mobile.screenshot({ path: outputPath('resume-mobile.png'), fullPage: true })
await mobile.close()

await captureViewport(390, 844, 'home-mobile-dark.png', { dark: true })
await captureViewport(390, 844, 'home-mobile-light.png')

const menu = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await prepare(menu)
await menu.getByRole('button', { name: 'Open navigation' }).click()
await menu.screenshot({ path: outputPath('menu-mobile-open.png') })
await menu.close()

const portraitCheck = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 })
await portraitCheck.setContent(`<!doctype html><style>
  *{box-sizing:border-box}body{margin:0;padding:24px;background:#d6dde1;font:700 14px system-ui;color:#10202c}
  main{display:grid;grid-template-columns:1fr 1fr;gap:18px;height:852px}.panel{position:relative;overflow:hidden;display:grid;place-items:center;border:1px solid #81929d;border-radius:18px}
  .panel span{position:absolute;left:16px;top:14px;padding:6px 9px;background:#ffffffd9;border-radius:6px;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
  .panel img{height:92%;max-width:92%;object-fit:contain}.white{background:#fff}.black{background:#000}.gray{background:#7d858a}.site{background:radial-gradient(circle at 50% 30%,#2b5265,#102b3c 38%,#06121f 76%)}
</style><main>${['white','black','gray','site'].map((tone) => `<section class="panel ${tone}"><span>${tone}</span><img src="${baseUrl}assets/sebastian-astroza-portrait-v2.webp" alt="Portrait edge check on ${tone}"></section>`).join('')}</main>`)
await portraitCheck.locator('img').first().waitFor({ state: 'visible' })
await portraitCheck.screenshot({ path: outputPath('portrait-background-check.png') })
await portraitCheck.close()

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
await prepare(desktop)
await desktop.screenshot({ path: outputPath('home-desktop.png'), fullPage: true })
await captureSection(desktop, '.hero', 'hero-desktop.png')
await captureSection(desktop, '#autismoconecta-case-study', 'autismoconecta-case-study-desktop.png')
await prepare(desktop, `${baseUrl}#/resume`)
await desktop.screenshot({ path: outputPath('resume-desktop.png'), fullPage: true })
await desktop.close()

await browser.close()
console.log(`Captured ${homeViewports.length + 16} responsive portfolio views in docs/screenshots/.`)
