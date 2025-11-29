import { World, IWorldOptions, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { BrowserManager } from '../fixtures/browser.fixture';
import { Logger } from '../utils/logger';
import { environment } from '../config/environment';

export interface CustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  logger: Logger;
  init(browserType?: 'chromium' | 'firefox' | 'webkit'): Promise<void>;
  cleanup(): Promise<void>;
}

export class CustomWorldImpl extends World implements CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  logger: Logger;

  constructor(options: IWorldOptions) {
    super(options);
    this.logger = new Logger('CustomWorld');
  }

  async init(browserType?: 'chromium' | 'firefox' | 'webkit'): Promise<void> {
    this.logger.info('Initializing world');
    
    // Get browser type from world parameters or environment
    const browser = browserType || this.parameters?.browser || environment.get('browser');
    
    this.browser = await BrowserManager.launchBrowser(browser);
    
    // Try to get existing page/context first (for non-login features)
    try {
      this.page = BrowserManager.getPage();
      this.context = BrowserManager.getContext();
      this.logger.info('Reusing existing page and context');
    } catch (error) {
      // If page/context don't exist, create new ones
      this.context = await BrowserManager.createContext();
      this.page = await BrowserManager.createPage();
      this.logger.info('Created new page and context');
    }
    
    this.logger.info('World initialized successfully');
  }

  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up world');
    // Only cleanup page and context for login features
    // For non-login features, page/context are kept open to maintain login state
    await BrowserManager.cleanupScenario();
    this.logger.info('World cleanup completed');
  }
}

// Set default timeout
setDefaultTimeout(environment.get('timeout'));

// Set world constructor
setWorldConstructor(CustomWorldImpl);
