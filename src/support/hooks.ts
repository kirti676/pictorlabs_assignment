import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { BrowserManager } from '../fixtures/browser.fixture';
import { Logger } from '../utils/logger';
import { DataHelper } from '../utils/data.helper';
import { LoginPage } from '../pages/login.page';
import { environment } from '../config/environment';
import { HeaderComponent } from '../components/header.components';
import { SidebarComponent } from '../components/sidebar.components';

const logger = new Logger('Hooks');

// Track login state to avoid redundant logins per feature
let isLoggedInForFeature = false;

// Initialize test data before all scenarios
BeforeAll(async function () {
  logger.info('=== Test Suite Started ===');
  
  DataHelper.loadTestData();
  logger.info('Test data loaded');
});

BeforeAll({ timeout: 60000 }, async function () {
  logger.info(`\n=== Starting Feature: Launching browser instance ===`);
  
  isLoggedInForFeature = false;
  
  await BrowserManager.launchBrowserForFeature();
  logger.info('Browser instance ready for feature');
});

// Setup scenario with one-time login optimization
Before(async function (this: CustomWorld, { pickle, gherkinDocument }) {
  logger.info(`\n=== Starting Scenario: ${pickle.name} ===`);
  this.logger = new Logger(pickle.name);
  
  const featureTags = gherkinDocument.feature?.tags?.map(tag => tag.name) || [];
  const isLoginFeature = featureTags.includes('@login');
  
  // Clean up for login scenarios to ensure fresh state
  if (isLoginFeature) {
    try {
      await BrowserManager.cleanupScenario();
      this.logger.info('Login feature: Cleaned up previous context to ensure logged-out state');
    } catch (error) {
    }
  }
  
  await this.init();
  this.logger.info('Scenario initialized');
  
  // Perform login once per feature for non-login scenarios
  if (!isLoginFeature && !isLoggedInForFeature) {
    this.logger.info('Performing one-time login for feature');
    
    const loginPage = new LoginPage(this.page);
    const baseUrl = environment.get('baseUrl');
    
    await loginPage.navigateToLoginPage(baseUrl);
    const credentials = DataHelper.getLoginCredentials('validUser');
    await loginPage.enterUsername(credentials.username);
    await loginPage.enterPassword(credentials.password);
    await loginPage.clickLoginButton();
    await loginPage.waitForSuccessfulLogin();
    
    await this.page.waitForLoadState('networkidle');
    const headerComponent = new HeaderComponent(this.page);
    const sidebarComponent = new SidebarComponent(this.page);
    
    const isHeaderVisible = await headerComponent.isHeaderVisible();
    const isSidebarVisible = await sidebarComponent.isVisible();
    
    if (isHeaderVisible && isSidebarVisible) {
      isLoggedInForFeature = true;
      this.logger.info('One-time login completed successfully for feature');
    } else {
      throw new Error('Login verification failed');
    }
  }
});

Before({ tags: '@smoke' }, function () {
  logger.info('Running smoke test');
});

Before({ tags: '@regression' }, function () {
  logger.info('Running regression test');
});

// Capture failure artifacts and cleanup after each scenario
After(async function (this: CustomWorld, { pickle, result, gherkinDocument }) {
  logger.info(`\n=== Scenario ${pickle.name} - Status: ${result?.status} ===`);

  if (result?.status === Status.FAILED) {
    logger.error(`Scenario failed: ${pickle.name}`);
    await BrowserManager.takeScreenshotOnFailure(pickle.name);
    
    if (this.page) {
      const screenshot = await this.page.screenshot();
      this.attach(screenshot, 'image/png');
    }

    if (result.message) {
      this.attach(`Error: ${result.message}`, 'text/plain');
    }
  } else if (result?.status === Status.PASSED) {
    logger.info(`Scenario passed: ${pickle.name}`);
  }

  const featureTags = gherkinDocument.feature?.tags?.map(tag => tag.name) || [];
  const isLoginFeature = featureTags.includes('@login');
  
  if (isLoginFeature) {
    await this.cleanup();
    logger.info('Login feature: Scenario cleanup completed (page and context closed)\n');
  } else {
    logger.info('Non-login feature: Keeping page and context open to maintain login state\n');
  }
});

AfterAll({ timeout: 30000 }, async function () {
  logger.info(`\n=== Completing Feature: Closing browser instance ===`);
  
  isLoggedInForFeature = false;
  
  await BrowserManager.closeBrowserForFeature();
  logger.info('Browser instance closed for feature');
});

AfterAll(async function () {
  logger.info('=== Test Suite Completed ===');
});
