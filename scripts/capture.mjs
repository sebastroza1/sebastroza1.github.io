import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const baseUrl = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4173/'
const outputDirectory = new URL('../docs/screenshots/', import.meta.url)

await mkdir(outputDirectory, { recursive: true })
const browser = await chromium.launch()

async function revealFullPage(page) {
  await page.addStyleTag({ content: '.content-section, .contact-section { content-visibility: visible !important; }' })
  await page.evaluate(() => window.scrollTo(0, 0))
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
await desktop.goto(baseUrl, { waitUntil: 'networkidle' })
await revealFullPage(desktop)
await desktop.screenshot({ path: fileURLToPath(new URL('home-desktop.png', outputDirectory)), fullPage: true })

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await mobile.goto(`${baseUrl}#/projects`, { waitUntil: 'networkidle' })
await revealFullPage(mobile)
await mobile.screenshot({ path: fileURLToPath(new URL('projects-mobile.png', outputDirectory)), fullPage: true })

await browser.close()
console.log('Captured desktop and mobile screenshots in docs/screenshots/.')
