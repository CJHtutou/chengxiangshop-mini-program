import { expect, test } from '@playwright/test'

test('H5 首页加载并可浏览商品', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('本周推荐')).toBeVisible()
  const product = page.locator('.product-card').first()
  await expect(product).toBeVisible()
  await product.click()
  await expect(page.getByText('商品详情').first()).toBeVisible()
})
