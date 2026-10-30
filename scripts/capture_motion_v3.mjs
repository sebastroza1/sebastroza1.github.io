import { chromium } from '@playwright/test'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const variant = process.argv[2]
if (!['before', 'after'].includes(variant)) throw new Error('Usage: node scripts/capture_motion_v3.mjs before|after')

const baseUrl = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4173/'
const evidenceRoot = new URL(`../docs/evidence/motion-v3/${variant}/`, import.meta.url)
const framesRoot = new URL('frames/', evidenceRoot)
const filePath = (name, root = evidenceRoot) => fileURLToPath(new URL(name, root))
await mkdir(evidenceRoot, { recursive: true })
await mkdir(framesRoot, { recursive: true })

const browser = await chromium.launch()

async function prepare(page, url = baseUrl) {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    localStorage.setItem('portfolio-language', 'en')
    localStorage.setItem('portfolio-theme', 'dark')
  })
  await page.goto(url, { waitUntil: 'networkidle' })
}

async function recordDesktop() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: filePath('raw-desktop/'), size: { width: 1440, height: 900 } },
  })
  const page = await context.newPage()
  const video = page.video()
  await prepare(page)
  await page.waitForTimeout(1100)
  await page.locator('.featured-section').scrollIntoViewIfNeeded()
  await page.waitForTimeout(950)
  await page.getByRole('link', { name: 'View projects' }).click()
  await page.waitForTimeout(850)
  await page.locator('.project-card .card-link').first().click()
  await page.waitForTimeout(850)
  await page.getByRole('link', { name: 'Back to projects' }).click()
  await page.waitForTimeout(750)
  await page.getByRole('button', { name: 'Resume' }).click()
  await page.waitForTimeout(850)
  await page.getByRole('button', { name: 'Home' }).click()
  await page.waitForTimeout(950)
  await page.getByRole('button', { name: 'Experience' }).click()
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: 'Skills' }).click()
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: 'Contact' }).click()
  await page.waitForTimeout(1100)
  await page.close()
  const rawPath = await video.path()
  const output = filePath('desktop-1440.webm')
  await video.saveAs(output)
  await context.close()
  if (rawPath !== output) await unlink(rawPath).catch(() => {})
}

async function recordMobile() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: { dir: filePath('raw-mobile/'), size: { width: 390, height: 844 } },
  })
  const page = await context.newPage()
  const video = page.video()
  await prepare(page)
  await page.waitForTimeout(1100)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.waitForTimeout(650)
  await page.getByRole('button', { name: 'Projects' }).click()
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.waitForTimeout(450)
  await page.getByRole('button', { name: 'Home' }).click()
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Experience' }).click()
  await page.waitForTimeout(950)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Skills' }).click()
  await page.waitForTimeout(1050)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Contact' }).click()
  await page.waitForTimeout(1100)
  await page.close()
  const rawPath = await video.path()
  const output = filePath('mobile-390.webm')
  await video.saveAs(output)
  await context.close()
  if (rawPath !== output) await unlink(rawPath).catch(() => {})
}

async function captureTransitionFrames() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await prepare(page)
  await page.waitForTimeout(900)
  const checkpoints = [0, 120, 250, 400, 650]
  const samples = []
  const startedAt = Date.now()
  await page.getByRole('link', { name: 'View projects' }).click()
  for (const checkpoint of checkpoints) {
    const remaining = checkpoint - (Date.now() - startedAt)
    if (remaining > 0) await page.waitForTimeout(remaining)
    const routeShell = page.locator('.route-shell')
    const style = await routeShell.evaluate((element) => {
      const computed = getComputedStyle(element)
      return { opacity: computed.opacity, transform: computed.transform, className: element.className }
    })
    const elapsed = Date.now() - startedAt
    await page.screenshot({ path: filePath(`route-${String(checkpoint).padStart(3, '0')}ms.png`, framesRoot) })
    samples.push({ checkpoint, elapsed, ...style })
  }
  await writeFile(filePath('route-frame-manifest.json', framesRoot), `${JSON.stringify(samples, null, 2)}\n`)
  await page.close()
}

await recordDesktop()
await recordMobile()
await captureTransitionFrames()
await browser.close()
console.log(`Captured Motion V3 ${variant} evidence at ${fileURLToPath(evidenceRoot)}`)
