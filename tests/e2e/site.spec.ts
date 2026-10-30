import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('home presents evidence and keyboard navigation', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Building reliable software/i })).toBeVisible()
  await expect(page.getByText('Engineering evidence, not decorative claims.')).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await expect(page.getByRole('heading', { name: 'Before / after performance evidence' })).toBeVisible()
  await expect(page.getByText('Regression, although 0.062 remains below 0.1.')).toBeVisible()
})

test('project filters lead to a detailed case study', async ({ page }) => {
  await page.goto('/#/projects')
  await page.getByLabel('Search projects').fill('integrity')
  await expect(page.getByRole('heading', { name: 'C++ File Integrity Toolkit' })).toBeVisible()
  await page.getByRole('link', { name: 'View case study' }).click()
  await expect(page.getByRole('heading', { name: 'C++ File Integrity Toolkit', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Limitations' })).toBeVisible()
})

test('language and theme choices survive navigation', async ({ page }) => {
  await page.getByRole('button', { name: 'Cambiar a español' }).click()
  await page.getByRole('button', { name: 'Use dark theme' }).click()
  await page.goto('/#/projects')
  await expect(page.getByRole('heading', { name: 'Proyectos construidos para ser inspeccionados.' })).toBeVisible()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('resume route publishes two working PDF-only downloads', async ({ page, request }) => {
  await page.goto('/#/resume')
  const downloadLinks = page.getByRole('main').getByRole('link')
  await expect(downloadLinks).toHaveCount(2)
  const targets = await downloadLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')).filter(Boolean) as string[])
  for (const target of targets) {
    const response = await request.get(target)
    expect(response.ok()).toBeTruthy()
    expect((await response.body()).byteLength).toBeGreaterThan(10_000)
  }
})

test('portrait and direct contact links are visible and correctly targeted', async ({ page }, testInfo) => {
  const portrait = page.getByRole('img', { name: 'Portrait of Sebastián Astroza wearing a blue shirt' })
  await expect(portrait).toBeVisible()
  await expect(portrait).toHaveJSProperty('complete', true)
  if (testInfo.project.name.includes('mobile')) {
    const box = await portrait.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    expect(box!.height).toBeLessThan(page.viewportSize()!.height * 0.62)
  }
  await page.getByRole('link', { name: /sebastroza10@gmail.com/i }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('link', { name: /sebastroza10@gmail.com/i })).toHaveAttribute('href', 'mailto:sebastroza10@gmail.com')
  await expect(page.getByRole('link', { name: /LinkedIn — Sebastián Astroza/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/sebastian-a-677745276/')
  await expect(page.getByRole('link', { name: /github.com\/sebastroza1/i })).toHaveAttribute('href', 'https://github.com/sebastroza1')
})

test('every published project card resolves to one unique detail route', async ({ page }) => {
  await page.goto('/#/projects')
  const links = await page.locator('a[href^="#/projects/"]').evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('href')).filter((href): href is string => Boolean(href)),
  )
  const uniqueLinks = [...new Set(links)]
  expect(uniqueLinks).toHaveLength(19)
  expect(links).toHaveLength(19)

  for (const href of uniqueLinks) {
    await page.goto(`/${href}`)
    await expect(page.locator('main.detail-page')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to projects' })).toBeVisible()
  }
})

test('responsive routes do not create horizontal overflow', async ({ page }) => {
  for (const route of ['/', '/#/projects', '/#/resume']) {
    await page.goto(route)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})

test('scroll reveal and route transitions activate without blocking content', async ({ page }) => {
  const proofBand = page.locator('.proof-band')
  await expect(proofBand).toHaveClass(/reveal-target/)
  await proofBand.scrollIntoViewIfNeeded()
  await expect(proofBand).toHaveClass(/is-visible/)

  await page.getByRole('link', { name: 'View projects' }).click()
  await expect(page.locator('.route-shell')).toBeVisible()
  await expect(page.locator('.nav-links button').filter({ hasText: 'Projects' })).toHaveAttribute('aria-current', 'page')
})

test('mobile menu opens and reaches projects', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'mobile-only interaction')
  await page.getByRole('button', { name: 'Toggle menu' }).click()
  await page.getByRole('button', { name: 'Projects' }).click()
  await expect(page.getByRole('heading', { name: 'Projects built to be inspected.' })).toBeVisible()
})
