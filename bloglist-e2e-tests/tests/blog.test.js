const { test, expect, beforeEach, describe } = require('@playwright/test');
const axios = require('axios');

describe('Blog app', () => {
	beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	describe('Login', () => {
		beforeEach(async ({ page, request }) => {
			// Empty the database
			await axios.post('http://localhost:3001/api/test/reset');

			// Create a user
			await axios.post('http://localhost:3001/api/users', {
				username: 'testuser',
				name: 'Test User',
				password: 'password'
			});
		});

		test('Login form is shown', async ({ page }) => {
			await expect(page.locator('form#login')).toBeVisible();
		});

		test('succeeds with correct credentials', async ({ page }) => {
			await page.fill('input[name="username"]', 'testuser');
			await page.fill('input[name="password"]', 'password');
			await page.click('button[type="submit"]');
			await expect(page.locator('text=logged in')).toBeVisible();
		});

		test('fails with wrong credentials', async ({ page }) => {
			await page.fill('input[name="username"]', 'testuser');
			await page.fill('input[name="password"]', 'wrongpassword');
			await page.click('button[type="submit"]');
			await expect(page.locator('text=wrong credentials')).toBeVisible();
		});
	});

	describe('When logged in', () => {
		beforeEach(async ({ page }) => {
			// Log in as testuser
			await page.goto('http://localhost:5173');
			await page.fill('input[name="username"]', 'testuser');
			await page.fill('input[name="password"]', 'password');
			await page.click('button[type="submit"]');
			await expect(page.locator('text=logged in')).toBeVisible();
		});

		test('a new blog can be created', async ({ page }) => {
			await page.click('button#new-blog');
			await page.fill('input[name="title"]', 'New Blog Title');
			await page.fill('input[name="author"]', 'Author Name');
			await page.fill('input[name="url"]', 'http://example.com');
			await page.click('button[type="submit"]');
			await expect(page.locator('text=New Blog Title')).toBeVisible();
		});

		test('a blog can be liked', async ({ page }) => {
			await page.click('button#view-details');
			await page.click('button#like');
			await expect(page.locator('text=likes 1')).toBeVisible();
		});

		test('a blog can be deleted by the creator', async ({ page }) => {
			await page.click('button#view-details');
			await page.click('button#delete');
			await page.on('dialog', dialog => dialog.accept());
			await expect(page.locator('text=New Blog Title')).not.toBeVisible();
		});

		test('only the creator can see the delete button', async ({ page }) => {
			await page.click('button#view-details');
			await expect(page.locator('button#delete')).toBeVisible();
		});

		test('blogs are ordered by likes', async ({ page }) => {
			await page.click('button#like');
			await expect(page.locator('.blog').nth(0)).toContainText('Most Liked Blog');
		});
	});
});
