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
    this.context = await BrowserManager.createContext();
    this.page = await BrowserManager.createPage();
    
    this.logger.info('World initialized successfully');
  }

  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up world');
    await BrowserManager.cleanup();
    this.logger.info('World cleanup completed');
  }
}

// Set default timeout
setDefaultTimeout(environment.get('timeout'));

// Set world constructor
setWorldConstructor(CustomWorldImpl);
