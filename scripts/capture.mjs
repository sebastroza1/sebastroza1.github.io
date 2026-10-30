import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const baseUrl = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4173/'
const outputDirectory = new URL('../docs/screenshots/', import.meta.url)

await mkdir(outputDirectory, { recursive: true })
const browser = await chromium.launch()

async function revealFullPage(page) {
  await page.addStyleTag({ content: '.content-section, .contact-section { content-visibility: visible !important; } .reveal-target { opacity: 1 !important; transform: none !important; } .route-shell { animation: none !important; }' })
  await page.evaluate(() => window.scrollTo(0, 0))
}

async function captureSection(page, selector, filename) {
  const captureStyle = await page.addStyleTag({ content: '.site-header, .skip-link { visibility: hidden !important; }' })
  await page.locator(selector).screenshot({ path: fileURLToPath(new URL(filename, outputDirectory)) })
  await captureStyle.evaluate((element) => element.remove())
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
await desktop.goto(baseUrl, { waitUntil: 'networkidle' })
await revealFullPage(desktop)
await desktop.screenshot({ path: fileURLToPath(new URL('home-desktop.png', outputDirectory)), fullPage: true })
await captureSection(desktop, '.hero', 'hero-desktop.png')
await captureSection(desktop, '#autismoconecta-case-study', 'autismoconecta-case-study-desktop.png')
await desktop.goto(`${baseUrl}#/resume`, { waitUntil: 'networkidle' })
await revealFullPage(desktop)
await desktop.screenshot({ path: fileURLToPath(new URL('resume-desktop.png', outputDirectory)), fullPage: true })

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await mobile.goto(`${baseUrl}#/projects`, { waitUntil: 'networkidle' })
await revealFullPage(mobile)
await mobile.screenshot({ path: fileURLToPath(new URL('projects-mobile.png', outputDirectory)), fullPage: true })
await mobile.goto(baseUrl, { waitUntil: 'networkidle' })
await revealFullPage(mobile)
await mobile.screenshot({ path: fileURLToPath(new URL('home-mobile.png', outputDirectory)), fullPage: true })
await captureSection(mobile, '.hero', 'hero-mobile.png')
await captureSection(mobile, '#autismoconecta-case-study', 'autismoconecta-case-study-mobile.png')

const narrow = await browser.newPage({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 1 })
await narrow.goto(baseUrl, { waitUntil: 'networkidle' })
await revealFullPage(narrow)
await captureSection(narrow, '.hero', 'hero-mobile-360.png')

const mobileDark = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await mobileDark.goto(baseUrl, { waitUntil: 'networkidle' })
await mobileDark.evaluate(() => localStorage.setItem('portfolio-theme', 'dark'))
await mobileDark.reload({ waitUntil: 'networkidle' })
await revealFullPage(mobileDark)
await captureSection(mobileDark, '.hero', 'hero-mobile-dark.png')

const compact = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1 })
await compact.goto(baseUrl, { waitUntil: 'networkidle' })
await revealFullPage(compact)
await captureSection(compact, '.hero', 'hero-compact-desktop.png')

await browser.close()
console.log('Captured home, resume, project catalogue and professional case-study screenshots in docs/screenshots/.')
