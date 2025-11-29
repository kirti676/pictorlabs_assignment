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

// Track if login has been performed for current feature
let isLoggedInForFeature = false;

/**
 * Before All Hook - Runs once before all scenarios in the entire test suite
 */
BeforeAll(async function () {
  logger.info('=== Test Suite Started ===');
  
  // Load test data
  DataHelper.loadTestData();
  logger.info('Test data loaded');
});

/**
 * Before All Hook - Runs once before all scenarios in each feature file
 * This launches one browser instance per feature file
 */
BeforeAll({ timeout: 60000 }, async function () {
  logger.info(`\n=== Starting Feature: Launching browser instance ===`);
  
  // Reset login flag for new feature
  isLoggedInForFeature = false;
  
  // Launch browser once per feature
  await BrowserManager.launchBrowserForFeature();
  logger.info('Browser instance ready for feature');
});

/**
 * Before Hook - Runs before each scenario
 * Creates a new page/context but reuses the browser instance
 * For non-login features, performs login once per feature file
 */
Before(async function (this: CustomWorld, { pickle, gherkinDocument }) {
  logger.info(`\n=== Starting Scenario: ${pickle.name} ===`);
  this.logger = new Logger(pickle.name);
  
  // Initialize world with existing browser
  await this.init();
  this.logger.info('Scenario initialized');
  
  // Check if this is NOT a login feature and login hasn't been performed yet for this feature
  const featureTags = gherkinDocument.feature?.tags?.map(tag => tag.name) || [];
  const isLoginFeature = featureTags.includes('@login');
  
  if (!isLoginFeature && !isLoggedInForFeature) {
    this.logger.info('Performing one-time login for feature');
    
    const loginPage = new LoginPage(this.page);
    const baseUrl = environment.get('baseUrl');
    
    // Perform login
    await loginPage.navigateToLoginPage(baseUrl);
    const credentials = DataHelper.getLoginCredentials('validUser');
    await loginPage.enterUsername(credentials.username);
    await loginPage.enterPassword(credentials.password);
    await loginPage.clickLoginButton();
    await loginPage.waitForSuccessfulLogin();
    
    // Verify login success
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

/**
 * Before Hook for specific tags
 */
Before({ tags: '@smoke' }, function () {
  logger.info('Running smoke test');
});

Before({ tags: '@regression' }, function () {
  logger.info('Running regression test');
});

/**
 * After Hook - Runs after each scenario
 * For non-login features: keeps browser, page and context open to maintain login state
 * For login features: closes page/context but keeps browser running
 */
After(async function (this: CustomWorld, { pickle, result, gherkinDocument }) {
  logger.info(`\n=== Scenario ${pickle.name} - Status: ${result?.status} ===`);

  // Take screenshot on failure
  if (result?.status === Status.FAILED) {
    logger.error(`Scenario failed: ${pickle.name}`);
    await BrowserManager.takeScreenshotOnFailure(pickle.name);
    
    // Attach screenshot to report
    if (this.page) {
      const screenshot = await this.page.screenshot();
      this.attach(screenshot, 'image/png');
    }

    // Attach error message
    if (result.message) {
      this.attach(`Error: ${result.message}`, 'text/plain');
    }
  } else if (result?.status === Status.PASSED) {
    logger.info(`Scenario passed: ${pickle.name}`);
  }

  // Check if this is a login feature
  const featureTags = gherkinDocument.feature?.tags?.map(tag => tag.name) || [];
  const isLoginFeature = featureTags.includes('@login');
  
  // For login feature, cleanup after each scenario (need fresh login for each test)
  // For other features, keep the page and context to maintain login state
  if (isLoginFeature) {
    await this.cleanup();
    logger.info('Login feature: Scenario cleanup completed (page and context closed)\n');
  } else {
    logger.info('Non-login feature: Keeping page and context open to maintain login state\n');
  }
});

/**
 * After All Hook - Runs once after all scenarios in each feature file
 * This closes the browser instance for the feature
 */
AfterAll({ timeout: 30000 }, async function () {
  logger.info(`\n=== Completing Feature: Closing browser instance ===`);
  
  // Reset login flag
  isLoggedInForFeature = false;
  
  // Close browser after all scenarios in the feature
  await BrowserManager.closeBrowserForFeature();
  logger.info('Browser instance closed for feature');
});

/**
 * After All Hook - Runs once after all scenarios in the entire test suite
 */
AfterAll(async function () {
  logger.info('=== Test Suite Completed ===');
});
