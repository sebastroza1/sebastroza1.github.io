import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('home presents evidence and keyboard navigation', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /I build reliable systems/i })).toBeVisible()
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
  await expect(portrait).toHaveAttribute('src', '/assets/sebastian-astroza-portrait-v2.webp')
  const transparentTopCorners = await portrait.evaluate((element) => {
    const image = element as HTMLImageElement
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0)
    return [
      context.getImageData(0, 0, 1, 1).data[3],
      context.getImageData(canvas.width - 1, 0, 1, 1).data[3],
    ]
  })
  expect(transparentTopCorners).toEqual([0, 0])
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

test('contact email can be copied without hiding the written address', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' })
  await page.getByRole('button', { name: 'Copy email' }).scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Copy email' }).click()
  await expect(page.getByText('Email copied')).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('sebastroza10@gmail.com')
  await expect(page.getByRole('link', { name: /sebastroza10@gmail.com/i })).toBeVisible()
})

test('every published project card resolves to one unique detail route', async ({ page }) => {
  await page.goto('/#/projects')
  const projectLinks = page.locator('a[href^="#/projects/"]')
  await expect(projectLinks).toHaveCount(19)
  const links = await projectLinks.evaluateAll((elements) =>
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

test('required responsive matrix keeps the hero usable at every width', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'single cross-viewport audit')
  const viewports = [
    [320, 720], [360, 800], [375, 812], [390, 844], [414, 896], [430, 932],
    [600, 900], [768, 1024], [820, 1180], [1024, 900], [1280, 900], [1440, 1000], [1920, 1080],
    [844, 390], [932, 430],
  ]
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /I build reliable systems/i })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    const cta = await page.getByRole('link', { name: 'View projects' }).boundingBox()
    const portrait = await page.getByRole('img', { name: 'Portrait of Sebastián Astroza wearing a blue shirt' }).boundingBox()
    expect(cta).not.toBeNull()
    expect(cta!.height).toBeGreaterThanOrEqual(44)
    expect(portrait).not.toBeNull()
    expect(portrait!.width).toBeLessThanOrEqual(width)
  }
})

test('increased text size preserves navigation and avoids horizontal scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'single large-text audit')
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { font-size: 125% !important; }' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await expect(page.getByRole('link', { name: 'View projects' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden()
})

test('scroll reveal and route transitions activate without blocking content', async ({ page }) => {
  const proofBand = page.locator('.proof-band')
  await expect(proofBand).toHaveClass(/reveal-target/)
  await expect(proofBand).toHaveAttribute('data-motion', 'panel')
  await proofBand.scrollIntoViewIfNeeded()
  await expect(proofBand).toHaveClass(/is-visible/)

  const shell = page.locator('.route-shell')
  await page.getByRole('link', { name: 'View projects' }).click()
  await expect(shell).toHaveClass(/route-exiting/)
  await page.waitForTimeout(90)
  expect(Number(await shell.evaluate((element) => getComputedStyle(element).opacity))).toBeLessThan(1)
  await expect(page.getByRole('heading', { name: 'Projects built to be inspected.' })).toBeVisible()
  await expect(shell).toHaveClass(/route-(entering|idle)/)
  await expect(page.locator('.nav-links button').filter({ hasText: 'Projects' })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.nav-items')).toHaveAttribute('data-has-active', 'true')
})

test('motion system differentiates component families and animates metric evidence', async ({ page }) => {
  await expect(page.locator('.section-title').first()).toHaveAttribute('data-motion', 'title')
  await expect(page.locator('.featured-grid .project-card').first()).toHaveAttribute('data-motion', 'card')
  await expect(page.locator('.timeline article').first()).toHaveAttribute('data-motion', 'timeline')
  await expect(page.locator('.skills-grid article').first()).toHaveAttribute('data-motion', 'skill')
  const performance = page.locator('.performance-panel')
  await expect(performance).toHaveAttribute('data-motion', 'metrics')
  await performance.scrollIntoViewIfNeeded()
  await expect(performance).toHaveClass(/is-visible/)
  await expect.poll(() => performance.locator('.metric-bars > span').first().evaluate((element) => getComputedStyle(element).transform)).not.toContain('matrix(0')
})

test('navigation indicator follows the active destination', async ({ page }, testInfo) => {
  const indicator = page.locator('.nav-indicator')
  const mobile = testInfo.project.name.includes('mobile')
  if (mobile) await page.getByRole('button', { name: 'Open navigation' }).click()
  const homePosition = await indicator.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return { x: rect.x, y: rect.y }
  })
  if (mobile) await page.getByRole('button', { name: 'Projects' }).click()
  else await page.getByRole('link', { name: 'View projects' }).click()
  await expect(page.locator('.nav-links button').filter({ hasText: 'Projects' })).toHaveAttribute('aria-current', 'page')
  if (mobile) {
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await expect.poll(() => indicator.evaluate((element) => element.getBoundingClientRect().y)).toBeGreaterThan(homePosition.y + 10)
  } else await expect.poll(() => indicator.evaluate((element) => element.getBoundingClientRect().x)).toBeGreaterThan(homePosition.x + 10)
})

test('floating navigation compacts on scroll without covering the content', async ({ page }) => {
  const header = page.locator('.site-header')
  await page.waitForTimeout(600)
  const initialBox = await header.boundingBox()
  expect(initialBox).not.toBeNull()
  expect(initialBox!.x).toBeGreaterThan(0)
  expect(initialBox!.width).toBeLessThan(page.viewportSize()!.width)

  await page.evaluate(() => window.scrollTo(0, 500))
  await expect(header).toHaveClass(/is-scrolled/)
  await page.waitForTimeout(450)
  const compactBox = await header.boundingBox()
  expect(compactBox).not.toBeNull()
  expect(compactBox!.y).toBeGreaterThan(0)
  expect(compactBox!.height).toBeLessThanOrEqual(initialBox!.height)
})

test('direct section routes and browser history preserve navigation context', async ({ page }, testInfo) => {
  await page.goto('/#/#skills')
  await expect(page.getByRole('heading', { name: 'Engineering skills' })).toBeInViewport()
  await expect(page.locator('.nav-links button').filter({ hasText: 'Skills' })).toHaveAttribute('aria-current', 'page')
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Experience' }).click()
  await expect(page.getByRole('heading', { name: 'Professional experience' })).toBeInViewport()
  await expect(page.getByRole('heading', { name: 'Professional experience' })).toBeFocused()
  await expect(page.locator('#experience')).toHaveClass(/section-arrival/)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Engineering skills' })).toBeInViewport()
})

test('compressed desktop navigation and editorial grids stay balanced', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'desktop and tablet composition audit')
  await page.setViewportSize({ width: 900, height: 900 })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Projects' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  const aboutCopy = await page.locator('.large-copy').boundingBox()
  const aboutFacts = await page.locator('.about-facts').boundingBox()
  expect(aboutCopy).not.toBeNull()
  expect(aboutFacts).not.toBeNull()
  expect(aboutCopy!.width).toBeGreaterThan(360)
  expect(aboutFacts!.width).toBeGreaterThan(250)

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  const featured = page.locator('.featured-grid .project-card')
  const primary = await featured.nth(0).boundingBox()
  const secondary = await featured.nth(1).boundingBox()
  const third = await featured.nth(2).boundingBox()
  expect(primary).not.toBeNull()
  expect(secondary).not.toBeNull()
  expect(third).not.toBeNull()
  expect(primary!.width).toBeGreaterThan(secondary!.width * 2)
  expect(primary!.height).toBeLessThan(secondary!.height * 1.25)
  expect(Math.abs(secondary!.y - third!.y)).toBeLessThan(2)
})

test('a 200% zoom-equivalent viewport keeps navigation and actions usable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'single zoom-equivalent audit')
  await page.setViewportSize({ width: 720, height: 900 })
  await page.goto('/')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await expect(page.getByRole('link', { name: 'View projects' })).toBeVisible()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible()
})

test('primary navigation completes without browser console errors', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('link', { name: 'View projects' }).click()
  await expect(page.getByRole('heading', { name: 'Projects built to be inspected.' })).toBeVisible()
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Resume' }).click()
  await expect(page.getByRole('heading', { name: 'Resume' })).toBeVisible()
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Contact' }).click()
  await expect(page.getByRole('heading', { name: 'Let’s build useful, reliable systems.' })).toBeInViewport()
  expect(errors).toEqual([])
})

test('reduced motion keeps revealed content visible and navigation usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  const proofBand = page.locator('.proof-band')
  await expect(proofBand).toBeVisible()
  await expect(proofBand).toHaveCSS('opacity', '1')
  await page.getByRole('link', { name: 'View projects' }).click()
  await expect(page.getByRole('heading', { name: 'Projects built to be inspected.' })).toBeVisible()
})

test('project cards use a real single-column mobile composition', async ({ page }, testInfo) => {
  await page.goto('/#/projects')
  const cards = page.locator('.project-card')
  await expect(cards).toHaveCount(19)
  await cards.first().scrollIntoViewIfNeeded()
  const first = await cards.nth(0).boundingBox()
  const second = await cards.nth(1).boundingBox()
  expect(first).not.toBeNull()
  expect(second).not.toBeNull()
  if (testInfo.project.name.includes('mobile')) {
    expect(Math.abs(first!.x - second!.x)).toBeLessThan(2)
    expect(second!.y).toBeGreaterThan(first!.y + first!.height)
  } else expect(second!.x).toBeGreaterThan(first!.x)
})

test('mobile menu opens and reaches projects', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'mobile-only interaction')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Projects' }).click()
  await expect(page.getByRole('heading', { name: 'Projects built to be inspected.' })).toBeVisible()
})

test('mobile menu traps focus, closes with Escape and restores scrolling', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'mobile-only interaction')
  const menuButton = page.getByRole('button', { name: 'Open navigation' })
  await menuButton.click()
  await expect(page.getByRole('button', { name: 'Home' })).toBeFocused()
  await expect(page.locator('body')).toHaveClass(/nav-open/)
  const panel = await page.locator('.nav-links.open').boundingBox()
  expect(panel).not.toBeNull()
  expect(panel!.width).toBeLessThanOrEqual(360)
  expect(panel!.height).toBeLessThan(page.viewportSize()!.height)
  await expect(page.locator('.nav-links.open')).toHaveCSS('background-color', 'rgb(7, 21, 34)')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Home' })).not.toBeVisible()
  await expect(page.locator('body')).not.toHaveClass(/nav-open/)
  await expect(menuButton).toBeFocused()
  await menuButton.click()
  await page.locator('.menu-button').click()
  await expect(page.getByRole('button', { name: 'Home' })).not.toBeVisible()
})
