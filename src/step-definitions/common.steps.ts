import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { CommonPage } from '../pages/common.page';
import { environment } from '../config/environment';
import { DataHelper } from '../utils/data.helper';
import { HeaderComponent } from '../components/header.components';
import { SidebarComponent } from '../components/sidebar.components';
import { CustomWorld } from '../support/world';

// Common reusable step definitions across features
let loginPage: LoginPage;
let commonPage: CommonPage;
let headerComponent: HeaderComponent;
let sidebarComponent: SidebarComponent;

// Verify user is logged in or perform login if needed
Given('the user is logged in to the application', async function(this: CustomWorld) {
  this.logger.info('Verifying user is logged in');
  
  commonPage = new CommonPage(this.page);
  headerComponent = new HeaderComponent(this.page);
  sidebarComponent = new SidebarComponent(this.page);
  
  const isHeaderVisible = await headerComponent.isHeaderVisible();
  const isSidebarVisible = await sidebarComponent.isVisible();
  
  if (isHeaderVisible && isSidebarVisible) {
    this.logger.info('User is already logged in (login performed once per feature)');
    return;
  }
  
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

Then('the URL should contain {string}', async function(this: CustomWorld, urlPart: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(urlPart);
});

Given('the user is on the {string} tab', async function(this: CustomWorld, tabName: string) {
  await commonPage.navigateToTab(tabName);
});

When('the user clicks on the {string} tab', async function(this: CustomWorld, tabName: string) {
  await commonPage.clickTab(tabName);
});

Then('the {string} tab should be selected', async function(this: CustomWorld, tabName: string) {
  const tab = commonPage.getTab(tabName);
  await expect(tab).toHaveAttribute('aria-selected', 'true');
});

Then('the page should display the heading {string}', async function(this: CustomWorld, heading: string) {
  const headingElement = commonPage.getHeading(heading);
  await expect(headingElement).toBeVisible({ timeout: 10000 });
});

Then('the {string} heading should be displayed', async function(this: CustomWorld, heading: string) {
  const headingElement = commonPage.getHeading(heading);
  await expect(headingElement).toBeVisible();
});

Then('the page should display the description {string}', async function(this: CustomWorld, description: string) {
  const descriptionElement = commonPage.getTextElement(description);
  await expect(descriptionElement).toBeVisible();
});

Then('the {string} navigation button should be active', async function(this: CustomWorld, buttonName: string) {
  const isNavigationButtonActive = await sidebarComponent.isMenuItemActive(buttonName);
  expect(isNavigationButtonActive).toBeTruthy();
});

Then('the {string} navigation icon should be displayed', async function(this: CustomWorld, buttonName: string) {
  const isNavigationButtonIconVisible = await sidebarComponent.isMenuItemIconVisible(buttonName);
  expect(isNavigationButtonIconVisible).toBeTruthy();
});

When('the user clicks on the {string} button', async function(this: CustomWorld, buttonName: string) {
  await commonPage.clickButton(buttonName);
});

Then('the {string} button should be displayed', async function(this: CustomWorld, buttonName: string) {
  const button = commonPage.getButton(buttonName);
  await expect(button).toBeVisible();
});

Then('the page should display {string}', async function(this: CustomWorld, text: string) {
  const textElement = commonPage.getTextElement(text);
  await expect(textElement.first()).toBeVisible();
});

Then('the {string} should be displayed', async function(this: CustomWorld, elementName: string) {
  const element = commonPage.getTextElement(elementName);
  await expect(element.first()).toBeVisible();
});

Then('the search box should have placeholder {string}', async function(this: CustomWorld, placeholder: string) {
  const searchBox = commonPage.getSearchBoxByPlaceholder(placeholder);
  await expect(searchBox).toBeVisible();
});

Then('the following tabs should be displayed:', async function(this: CustomWorld, dataTable) {
  const tabs = dataTable.hashes();
  
  for (const tab of tabs) {
    const tabName = tab['Tab Name'];
    const tabElement = commonPage.getTab(tabName);
    await expect(tabElement).toBeVisible();
  }
});

Then('the {string} section should be displayed', async function(this: CustomWorld, sectionName: string) {
  const section = commonPage.getSectionHeading(sectionName);
  await expect(section.first()).toBeVisible();
});

When('the user clicks on {string}', async function(this: CustomWorld, elementName: string) {
  await commonPage.clickElement(elementName);
});

Then('the {string} tab should be selected by default', async function(this: CustomWorld, tabName: string) {
  const tab = commonPage.getTab(tabName);
  await expect(tab).toHaveAttribute('aria-selected', 'true');
});

