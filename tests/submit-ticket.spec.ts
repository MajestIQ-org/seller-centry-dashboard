import { test, expect } from '@playwright/test'

test.describe('Submit Ticket', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/')
    await page.getByPlaceholder(/email/i).fill('test@example.com')
    await page.getByPlaceholder(/password/i).fill('test123456')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
    
    // Open Submit Ticket modal
    await page.getByRole('button', { name: /Submit Ticket/i }).click()
  })

  test('should have all required fields', async ({ page }) => {
    await expect(page.getByLabel(/Subject/i)).toBeVisible()
    await expect(page.getByLabel(/Message/i)).toBeVisible()
    await expect(page.getByLabel(/Related ASIN/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling fields
    await page.getByRole('button', { name: /Send Ticket/i }).click()
    
    // Should show validation errors (browser built-in)
    const subjectInput = page.getByLabel(/Subject/i)
    const isInvalid = await subjectInput.evaluate((el: HTMLSelectElement) => !el.validity.valid)
    expect(isInvalid).toBe(true)
  })

  test('should validate ASIN format', async ({ page }) => {
    await page.getByLabel(/Subject/i).selectOption('Question')
    await page.getByLabel(/Message/i).fill('Test message')
    await page.getByLabel(/Related ASIN/i).fill('INVALID')
    
    await page.getByRole('button', { name: /Send Ticket/i }).click()
    
    // Should show ASIN format error
    await expect(page.getByText(/ASIN must be 10 characters/i)).toBeVisible()
  })

  test('should show success message after submission', async ({ page }) => {
    await page.getByLabel(/Subject/i).selectOption('Question')
    await page.getByLabel(/Message/i).fill('This is a test ticket message')
    
    await page.getByRole('button', { name: /Send Ticket/i }).click()
    
    // Should show success message
    await expect(page.getByText(/Ticket submitted successfully/i)).toBeVisible({ timeout: 10000 })
  })
})
