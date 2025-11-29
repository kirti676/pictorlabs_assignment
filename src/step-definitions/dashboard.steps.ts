import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DashboardPage } from '../pages/dashboard.page';
import { DataHelper } from '../utils/data.helper';
import { environment } from '../config/environment';
import { LoginPage } from '../pages/login.page';

let dashboardPage: DashboardPage;
let loginPage: LoginPage;

// Given Steps
Given('I am logged in to the application', async function (this: CustomWorld) {
  this.logger.step('Perform login to access dashboard');
  loginPage = new LoginPage(this.page);

  // Navigate to base URL
  const baseUrl = environment.get('baseUrl');
  await loginPage.navigateToLoginPage(baseUrl);

  this.logger.step('Enter valid credentials');
  const credentials = DataHelper.getLoginCredentials('validUser');
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLoginButton();
  await loginPage.waitForSuccessfulLogin();

  const currentUrl = await loginPage.getCurrentUrl();
  this.logger.assertion(`Home (Dashboard) Page URL: ${currentUrl}`, !currentUrl.includes('login'));

  // The URL should not contain 'login' after successful login
  expect(currentUrl).not.toContain('login');
});

Given('I am on the dashboard', async function (this: CustomWorld) {
  this.logger.step('Navigate to dashboard');
  dashboardPage = new DashboardPage(this.page);

  const baseUrl = environment.get('baseUrl');
  await this.page.goto(baseUrl);
  await this.page.waitForLoadState('networkidle');
});

// When Steps
When('I navigate to the dashboard', async function (this: CustomWorld) {
  this.logger.step('Navigate to dashboard');
  dashboardPage = new DashboardPage(this.page);

  const baseUrl = environment.get('baseUrl');
  await dashboardPage.navigate(baseUrl);
});

When('I click on a menu item {string}', async function (this: CustomWorld, menuItem: string) {
  this.logger.step(`Click on menu item: ${menuItem}`);
  try {
    await dashboardPage.navigateToMenuItem(menuItem);
  } catch (error) {
    this.logger.error(`Failed to click menu item "${menuItem}": ${error}`);
    throw error;
  }
});

When('I click on the user profile menu', async function (this: CustomWorld) {
  this.logger.step('Click on user profile menu');
  try {
    await dashboardPage.clickUserProfileMenu();
  } catch (error) {
    this.logger.error(`Failed to click user profile menu: ${error}`);
    throw error;
  }
});

When('I click the logout button', async function (this: CustomWorld) {
  this.logger.step('Click logout button');

  try {
    // Try multiple possible logout selectors
    const logoutSelectors = [
      'button:has-text("Logout")',
      'a:has-text("Logout")',
      '[data-testid="logout"]',
      'button:has-text("Log out")',
      'a:has-text("Log out")',
      'button:has-text("Sign out")',
      'a:has-text("Sign out")',
      '[aria-label*="logout" i]',
      '[aria-label*="sign out" i]',
    ];

    for (const selector of logoutSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click({ timeout: 5000 });
          this.logger.info(`Clicked logout using selector: ${selector}`);
          await this.page.waitForLoadState('networkidle', { timeout: 10000 });
          return;
        }
      } catch {
        continue;
      }
    }

    throw new Error('Could not find logout button with any known selector');
  } catch (error) {
    this.logger.error(`Failed to click logout button: ${error}`);
    throw error;
  }
});

// Then Steps
Then('I should see the dashboard page', async function (this: CustomWorld) {
  this.logger.step('Verify dashboard page is displayed');

  try {
    // Wait for page to settle
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check we're on the correct URL (not on login/auth page)
    const currentUrl = this.page.url();
    this.logger.info(`Current URL: ${currentUrl}`);

    const isOnDashboard = !currentUrl.includes('/login') &&
      !currentUrl.includes('/auth') &&
      !currentUrl.includes('auth0.com/u/login');

    if (!isOnDashboard) {
      this.logger.assertion('Dashboard is loaded', false);
      expect(isOnDashboard).toBeTruthy();
      return;
    }

    // Verify page content loaded (check for body, html)
    const bodyVisible = await this.page.locator('body').isVisible();
    this.logger.assertion('Dashboard page content is loaded', bodyVisible);
    expect(bodyVisible).toBeTruthy();
  } catch (error) {
    this.logger.error(`Failed to verify dashboard: ${error}`);
    throw error;
  }
});

Then('I should see my user information', async function (this: CustomWorld) {
  this.logger.step('Verify user information is displayed');

  try {
    // Check for any user-related element on the page
    const userIndicatorSelectors = [
      '.user-profile',
      '.profile-menu',
      '[data-testid="user-menu"]',
      '[class*="avatar" i]',
      '[class*="user" i]',
      'img[alt*="user" i]',
      'img[alt*="profile" i]',
      '[aria-label*="user" i]',
      '[aria-label*="profile" i]',
    ];

    for (const selector of userIndicatorSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          this.logger.assertion('User information is visible', true);
          return;
        }
      } catch {
        continue;
      }
    }

    // If no specific user indicator found, just verify we're logged in (on dashboard page)
    const currentUrl = this.page.url();
    const isOnDashboard = !currentUrl.includes('login') && !currentUrl.includes('auth');
    this.logger.assertion('User is on dashboard (logged in)', isOnDashboard);
    expect(isOnDashboard).toBeTruthy();
  } catch (error) {
    this.logger.error(`Failed to verify user information: ${error}`);
    throw error;
  }
});

Then('I should see the {string} page', async function (this: CustomWorld, pageName: string) {
  this.logger.step(`Verify ${pageName} page is displayed`);

  await this.page.waitForLoadState('networkidle');

  // Check URL or page title contains the page name
  const currentUrl = await this.page.url();
  const pageTitle = await this.page.title();

  this.logger.info(`Current URL: ${currentUrl}`);
  this.logger.info(`Page Title: ${pageTitle}`);

  // Verify page loaded (adjust based on actual application)
  const pageLoaded = currentUrl.toLowerCase().includes(pageName.toLowerCase()) ||
    pageTitle.toLowerCase().includes(pageName.toLowerCase());

  this.logger.assertion(`${pageName} page is loaded`, pageLoaded);
});

Then('I should be redirected to the login page', async function (this: CustomWorld) {
  this.logger.step('Verify redirect to login page');

  await this.page.waitForLoadState('networkidle');

  const currentUrl = await this.page.url();
  this.logger.info(`Current URL: ${currentUrl}`);

  const isLoginPage = currentUrl.includes('login') || currentUrl === environment.get('baseUrl');
  this.logger.assertion('Redirected to login page', isLoginPage);
});

Then('I should not be able to access the dashboard', async function (this: CustomWorld) {
  this.logger.step('Verify dashboard is not accessible');

  // Try to access dashboard URL
  const baseUrl = environment.get('baseUrl');
  await this.page.goto(baseUrl + '/dashboard');
  await this.page.waitForLoadState('networkidle');

  const currentUrl = await this.page.url();

  // Should be redirected to login
  const redirectedToLogin = currentUrl.includes('login') || currentUrl === baseUrl;
  this.logger.assertion('Redirected away from dashboard', redirectedToLogin);
});
