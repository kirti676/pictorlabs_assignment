import { World, IWorldOptions, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { BrowserManager } from '../fixtures/browser.fixture';
import { Logger } from '../utils/logger';
import { environment } from '../config/environment';

// Custom World interface extending Cucumber World with browser objects
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

  // Initialize browser, context, and page for scenario
  async init(browserType?: 'chromium' | 'firefox' | 'webkit'): Promise<void> {
    this.logger.info('Initializing world');
    
    const browser = browserType || this.parameters?.browser || environment.get('browser');
    
    this.browser = await BrowserManager.launchBrowser(browser);
    
    // Reuse existing page/context if available
    try {
      this.page = BrowserManager.getPage();
      this.context = BrowserManager.getContext();
      this.logger.info('Reusing existing page and context');
    } catch (error) {
      this.context = await BrowserManager.createContext();
      this.page = await BrowserManager.createPage();
      this.logger.info('Created new page and context');
    }
    
    this.logger.info('World initialized successfully');
  }

  // Clean up page and context while keeping browser alive
  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up world');
    await BrowserManager.cleanupScenario();
    this.logger.info('World cleanup completed');
  }
}

setDefaultTimeout(environment.get('timeout'));

setWorldConstructor(CustomWorldImpl);
