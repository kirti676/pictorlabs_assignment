import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { BrowserManager } from '../fixtures/browser.fixture';
import { Logger } from '../utils/logger';
import { DataHelper } from '../utils/data.helper';

const logger = new Logger('Hooks');

/**
 * Before All Hook - Runs once before all scenarios
 */
BeforeAll(async function () {
  logger.info('=== Test Suite Started ===');
  
  // Load test data
  DataHelper.loadTestData();
  logger.info('Test data loaded');
});

/**
 * Before Hook - Runs before each scenario
 */
Before(async function (this: CustomWorld, { pickle }) {
  logger.info(`\n=== Starting Scenario: ${pickle.name} ===`);
  this.logger = new Logger(pickle.name);
  
  // Initialize world
  await this.init();
  this.logger.info('Scenario initialized');
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
 */
After(async function (this: CustomWorld, { pickle, result }) {
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

  // Cleanup
  await this.cleanup();
  logger.info('Scenario cleanup completed\n');
});

/**
 * After All Hook - Runs once after all scenarios
 */
AfterAll(async function () {
  logger.info('=== Test Suite Completed ===');
  
  // Additional cleanup if needed
  // You can delete auth state here if you want fresh login each time
  // AuthHelper.deleteAuthState();
});
