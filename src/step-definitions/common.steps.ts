import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { environment } from '../config/environment';
import { DataHelper } from '../utils/data.helper';
import { HeaderComponent } from '../components/header.components';
import { SidebarComponent } from '../components/sidebar.components';
import { CustomWorld } from '../support/world';

let loginPage: LoginPage;
let headerComponent: HeaderComponent;
let sidebarComponent: SidebarComponent;

// Common login steps
// Note: For non-login features, login is now performed once in the Before hook
// This step just verifies the user is logged in
Given('the user is logged in to the application', async function(this: CustomWorld) {
  this.logger.info('Verifying user is logged in');
  
  // Check if already logged in by verifying header and sidebar are visible
  headerComponent = new HeaderComponent(this.page);
  sidebarComponent = new SidebarComponent(this.page);
  
  const isHeaderVisible = await headerComponent.isHeaderVisible();
  const isSidebarVisible = await sidebarComponent.isVisible();
  
  if (isHeaderVisible && isSidebarVisible) {
    this.logger.info('User is already logged in (login performed once per feature)');
    return;
  }
  
  // If not logged in (should not happen for non-login features), perform login
  this.logger.info('User not logged in, performing login now');
  const baseUrl = environment.get('baseUrl');
  
  loginPage = new LoginPage(this.page);
  
  this.logger.step('Navigate to login page');
  await loginPage.navigateToLoginPage(baseUrl);
  
  this.logger.step('Login with valid credentials');
  const credentials = DataHelper.getLoginCredentials('validUser');
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLoginButton();
  await loginPage.waitForSuccessfulLogin();

  this.logger.step('Verify login is successful');
  const currentUrl = await loginPage.getCurrentUrl();
  this.logger.assertion(`Home (Dashboard) Page URL: ${currentUrl}`, !currentUrl.includes('login'));
  expect(currentUrl).not.toContain('login');

  this.logger.step('Verify header & sidebar component is visible');
  await this.page.waitForLoadState('networkidle');

  const isHeaderVisibleAfterLogin = await headerComponent.isHeaderVisible();
  this.logger.assertion('Header component is visible', isHeaderVisibleAfterLogin);
  expect(isHeaderVisibleAfterLogin).toBeTruthy();

  const isSidebarVisibleAfterLogin = await sidebarComponent.isVisible();
  this.logger.assertion('Sidebar component is visible', isSidebarVisibleAfterLogin);
  expect(isSidebarVisibleAfterLogin).toBeTruthy();
});

// Common URL verification
Then('the URL should contain {string}', async function(this: CustomWorld, urlPart: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(urlPart);
});

// Common tab operations
Given('the user is on the {string} tab', async function(this: CustomWorld, tabName: string) {
  const tab = this.page.getByRole('tab', { name: tabName });
  const isSelected = await tab.getAttribute('aria-selected');
  
  if (isSelected !== 'true') {
    await tab.click();
    await this.page.waitForTimeout(1000);
  }
});

When('the user clicks on the {string} tab', async function(this: CustomWorld, tabName: string) {
  const tab = this.page.getByRole('tab', { name: tabName });
  await tab.click();
});

Then('the {string} tab should be selected', async function(this: CustomWorld, tabName: string) {
  const tab = this.page.getByRole('tab', { name: tabName });
  await expect(tab).toHaveAttribute('aria-selected', 'true');
});

// Common heading verification
Then('the page should display the heading {string}', async function(this: CustomWorld, heading: string) {
  const headingElement = this.page.getByRole('heading', { name: heading });
  await expect(headingElement).toBeVisible({ timeout: 10000 });
});

Then('the {string} heading should be displayed', async function(this: CustomWorld, heading: string) {
  const headingElement = this.page.getByRole('heading', { name: heading });
  await expect(headingElement).toBeVisible();
});

Then('the page should display the description {string}', async function(this: CustomWorld, description: string) {
  const descriptionElement = this.page.locator(`text=${description}`);
  await expect(descriptionElement).toBeVisible();
});

// Common navigation button verification
Then('the {string} navigation button should be active', async function(this: CustomWorld, buttonName: string) {
  const isNavigationButtonActive = await sidebarComponent.isMenuItemActive(buttonName);
  expect(isNavigationButtonActive).toBeTruthy();
});

// Common navigation button icon verification
Then('the {string} navigation icon should be displayed', async function(this: CustomWorld, buttonName: string) {
  const isNavigationButtonIconVisible = await sidebarComponent.isMenuItemIconVisible(buttonName);
  expect(isNavigationButtonIconVisible).toBeTruthy();
});

// Common button click
When('the user clicks on the {string} button', async function(this: CustomWorld, buttonName: string) {
  const button = this.page.getByRole('button', { name: buttonName });
  await button.click();
  await this.page.waitForTimeout(1000);
});

// Common button visibility
Then('the {string} button should be displayed', async function(this: CustomWorld, buttonName: string) {
  const button = this.page.getByRole('button', { name: buttonName });
  await expect(button).toBeVisible();
});

// Common text verification
Then('the page should display {string}', async function(this: CustomWorld, text: string) {
  const textElement = this.page.locator(`text=${text}`);
  await expect(textElement.first()).toBeVisible();
});

// Common element display verification
Then('the {string} should be displayed', async function(this: CustomWorld, elementName: string) {
  const element = this.page.locator(`text=${elementName}`);
  await expect(element.first()).toBeVisible();
});

Then('the search box should have placeholder {string}', async function(this: CustomWorld, placeholder: string) {
  const searchBox = this.page.getByPlaceholder(placeholder);
  await expect(searchBox).toBeVisible();
});

// Common tab display verification
Then('the following tabs should be displayed:', async function(this: CustomWorld, dataTable) {
  const tabs = dataTable.hashes();
  
  for (const tab of tabs) {
    const tabName = tab['Tab Name'];
    const tabElement = this.page.getByRole('tab', { name: tabName });
    await expect(tabElement).toBeVisible();
  }
});





// Common section display verification
Then('the {string} section should be displayed', async function(this: CustomWorld, sectionName: string) {
  const section = this.page.getByRole('heading', { name: sectionName, level: 6 });
  await expect(section.first()).toBeVisible();
});

// Common element click
When('the user clicks on {string}', async function(this: CustomWorld, elementName: string) {
  
  // Try different element types
  let element = this.page.getByRole('button', { name: elementName });
  let isVisible = await element.isVisible().catch(() => false);
  
  if (!isVisible) {
    element = this.page.getByRole('tab', { name: elementName });
    isVisible = await element.isVisible().catch(() => false);
  }
  
  if (!isVisible) {
    element = this.page.locator(`text=${elementName}`).first();
  }
  
  await element.click();
  await this.page.waitForTimeout(1000);
});

Then('the {string} tab should be selected by default', async function(this: CustomWorld, tabName: string) {
  const tab = this.page.getByRole('tab', { name: tabName });
  await expect(tab).toHaveAttribute('aria-selected', 'true');
});

