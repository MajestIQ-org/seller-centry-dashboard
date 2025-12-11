import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/')
    await page.getByPlaceholder(/email/i).fill('test@example.com')
    await page.getByPlaceholder(/password/i).fill('test123456')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
  })

  test('should display summary cards', async ({ page }) => {
    await expect(page.getByText(/Open Violations/i)).toBeVisible()
    await expect(page.getByText(/At-Risk Sales/i)).toBeVisible()
    await expect(page.getByText(/High Impact/i)).toBeVisible()
    await expect(page.getByText(/Needs Attention/i)).toBeVisible()
  })

  test('should display violations table', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: /ASIN/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Product/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Date/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Status/i })).toBeVisible()
  })

  test('should switch between Active and Resolved tabs', async ({ page }) => {
    // Check Active Violations tab is selected
    await expect(page.getByRole('button', { name: /Active Violations/i })).toBeVisible()
    
    // Click Resolved tab
    await page.getByRole('button', { name: /Resolved/i }).click()
    
    // Wait for content to change
    await page.waitForTimeout(500)
  })

  test('should open violation detail modal', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('button:has-text("View")', { timeout: 10000 })
    
    // Click first View button
    await page.getByRole('button', { name: /View/i }).first().click()
    
    // Check modal is visible
    await expect(page.getByRole('heading', { name: /Violation Details/i })).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: /Close/i }).click()
    await expect(page.getByRole('heading', { name: /Violation Details/i })).not.toBeVisible()
  })

  test('should open Submit Ticket modal', async ({ page }) => {
    await page.getByRole('button', { name: /Submit Ticket/i }).click()
    
    await expect(page.getByRole('heading', { name: /Submit Ticket/i })).toBeVisible()
    await expect(page.getByLabel(/Subject/i)).toBeVisible()
    await expect(page.getByLabel(/Message/i)).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: /Cancel/i }).click()
  })

  test('should open Invite User modal', async ({ page }) => {
    await page.getByRole('button', { name: /Invite User/i }).click()
    
    await expect(page.getByRole('heading', { name: /Invite User/i })).toBeVisible()
    await expect(page.getByLabel(/Email Address/i)).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: /Cancel/i }).click()
  })
})
