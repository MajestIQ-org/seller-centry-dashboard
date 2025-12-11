import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/')
    
    await page.getByPlaceholder(/email/i).fill('test@example.com')
    await page.getByPlaceholder(/password/i).fill('test123456')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
    
    // Check dashboard elements
    await expect(page.getByText(/Account Health Dashboard/i)).toBeVisible()
    await expect(page.getByText(/EXAMPLE/i)).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/')
    
    await page.getByPlaceholder(/email/i).fill('wrong@example.com')
    await page.getByPlaceholder(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show error message
    await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5000 })
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/')
    await page.getByPlaceholder(/email/i).fill('test@example.com')
    await page.getByPlaceholder(/password/i).fill('test123456')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
    
    // Logout
    await page.getByRole('button', { name: /logout/i }).click()
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
