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

test('resume route has no broken downloads', async ({ page }) => {
  await page.goto('/#/resume')
  await expect(page.getByText('File not yet provided')).toHaveCount(4)
  await expect(page.getByRole('main').getByRole('link')).toHaveCount(0)
})

test('every published project card resolves to one unique detail route', async ({ page }) => {
  await page.goto('/#/projects')
  const links = await page.locator('a[href^="#/projects/"]').evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('href')).filter((href): href is string => Boolean(href)),
  )
  const uniqueLinks = [...new Set(links)]
  expect(uniqueLinks).toHaveLength(18)
  expect(links).toHaveLength(18)

  for (const href of uniqueLinks) {
    await page.goto(`/${href}`)
    await expect(page.locator('main.detail-page')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to projects' })).toBeVisible()
  }
})

test('mobile menu opens and reaches projects', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'mobile-only interaction')
  await page.getByRole('button', { name: 'Toggle menu' }).click()
  await page.getByRole('button', { name: 'Projects' }).click()
  await expect(page.getByRole('heading', { name: 'Projects built to be inspected.' })).toBeVisible()
})
