import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../pages/login.page';
import { DataHelper } from '../utils/data.helper';
import { environment } from '../config/environment';
import { HeaderComponent } from '../components/header.components';

let loginPage: LoginPage;
let headerComponent: HeaderComponent;

// Given Steps
Given('I am on the login page', async function (this: CustomWorld) {
  this.logger.step('Navigate to login page');
  loginPage = new LoginPage(this.page);
  headerComponent = new HeaderComponent(this.page);
  const baseUrl = environment.get('baseUrl');
  await loginPage.navigateToLoginPage(baseUrl);
});

// When Steps
When('I enter valid credentials', async function (this: CustomWorld) {
  this.logger.step('Enter valid credentials');
  const credentials = DataHelper.getLoginCredentials('validUser');
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
});

When('I enter invalid credentials', async function (this: CustomWorld) {
  this.logger.step('Enter invalid credentials');
  const credentials = DataHelper.getLoginCredentials('invalidUser');
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
});

When('I enter username {string}', async function (this: CustomWorld, username: string) {
  this.logger.step(`Enter username: ${username}`);
  if (username) {
    await loginPage.enterUsername(username);
  }
});

When('I enter password {string}', async function (this: CustomWorld, password: string) {
  this.logger.step(`Enter password: ${password ? '***' : '(empty)'}`);
  if (password) {
    await loginPage.enterPassword(password);
  }
});

When('I click the login button', async function (this: CustomWorld) {
  this.logger.step('Click login button');
  await loginPage.clickLoginButton();
});

// Then Steps
Then('I should be redirected to the dashboard', async function (this: CustomWorld) {
  this.logger.step('Verify redirect to dashboard');
  await loginPage.waitForSuccessfulLogin();
  
  const currentUrl = await loginPage.getCurrentUrl();
  this.logger.assertion(`Home (Dashboard) Page URL: ${currentUrl}`, !currentUrl.includes('login'));
  
  // The URL should not contain 'login' after successful login
  expect(currentUrl).not.toContain('login');
});

Then('I should see the header component', async function (this: CustomWorld) {
  this.logger.step('Verify header component is visible');
  await this.page.waitForLoadState('networkidle');
  
  const isHeaderVisible = await headerComponent.isHeaderVisible();
  this.logger.assertion('Header component is visible', isHeaderVisible);
  expect(isHeaderVisible).toBeTruthy();
});

Then('I should see an error message', async function (this: CustomWorld) {
  this.logger.step('Verify error message is displayed');
  const expectedError = DataHelper.getLoginCredentials('invalidUser').message;
  
  const isErrorVisible = await loginPage.isErrorMessageVisible();
  this.logger.assertion('Error message is visible', isErrorVisible);
  
  if (isErrorVisible) {
    const errorText = await loginPage.getErrorMessage();
    this.logger.info(`Error message: ${errorText}`);
    expect(isErrorVisible).toBeTruthy();
    expect(errorText).toBe(expectedError)
  }
});

Then('I should see an error message {string}', async function (this: CustomWorld, expectedError: string) {
  this.logger.step('Verify error message is displayed');
  
  // Get all visible error messages
  const allErrors = await loginPage.getAllErrorMessages();
  this.logger.info(`Error messages found: ${allErrors}`);
  
  // Verify the expected error message matches
  this.logger.assertion(`Expected error: "${expectedError}"`, allErrors === expectedError);
  expect(allErrors).toBe(expectedError);
});

Then('I should remain on the login page', async function (this: CustomWorld) {
  this.logger.step('Verify still on login page');
  
  const currentUrl = await loginPage.getCurrentUrl();
  this.logger.assertion(`URL contains login: ${currentUrl}`, currentUrl.includes('login'));

  expect(currentUrl).toContain('login');
});
