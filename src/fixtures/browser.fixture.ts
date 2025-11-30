import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { environment } from '../config/environment';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const logger = new Logger('BrowserManager');

// Singleton browser manager for lifecycle control and resource management
export class BrowserManager {
  private static browser: Browser;
  private static context: BrowserContext;
  private static page: Page;
  private static browserLaunchedForFeature: boolean = false;

  // Launch browser once per feature for performance optimization
  static async launchBrowserForFeature(browserType?: 'chromium' | 'firefox' | 'webkit'): Promise<Browser> {
    if (this.browser && this.browserLaunchedForFeature) {
      logger.info('Browser already launched for this feature, reusing instance');
      return this.browser;
    }

    const selectedBrowser = browserType || environment.get('browser');
    logger.info(`Launching browser for feature: ${selectedBrowser}`);

    const browserConfig = {
      headless: environment.get('headless'),
      slowMo: environment.get('slowMo'),
      args: ['--start-maximized', '--start-fullscreen'],
    };

    switch (selectedBrowser) {
      case 'firefox':
        this.browser = await firefox.launch(browserConfig);
        break;
      case 'webkit':
        this.browser = await webkit.launch(browserConfig);
        break;
      default:
        this.browser = await chromium.launch(browserConfig);
    }

    this.browserLaunchedForFeature = true;
    logger.info('Browser launched successfully for feature');
    return this.browser;
  }

  static async launchBrowser(browserType?: 'chromium' | 'firefox' | 'webkit'): Promise<Browser> {
    if (this.browser && this.browserLaunchedForFeature) {
      logger.info('Reusing existing browser instance');
      return this.browser;
    }
    
    return this.launchBrowserForFeature(browserType);
  }

  static async createContext(options?: any): Promise<BrowserContext> {
    logger.info('Creating browser context');
    
    const contextOptions = {
      viewport: null,
      recordVideo: environment.get('videoOnFailure') ? {
        dir: './reports/videos/',
      } : undefined,
      ...options,
    };

    this.context = await this.browser.newContext(contextOptions);
    logger.info('Browser context created successfully');
    return this.context;
  }

  static async createPage(): Promise<Page> {
    logger.info('Creating new page');
    
    if (!this.context) {
      await this.createContext();
    }

    this.page = await this.context.newPage();
    
    this.page.setDefaultTimeout(environment.get('timeout'));
    
    logger.info('New page created successfully');
    return this.page;
  }

  static getPage(): Page {
    if (!this.page) {
      throw new Error('Page not initialized. Call createPage() first.');
    }
    return this.page;
  }

  static getContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Context not initialized. Call createContext() first.');
    }
    return this.context;
  }

  static getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call launchBrowser() first.');
    }
    return this.browser;
  }

  static async closePage(): Promise<void> {
    if (this.page) {
      logger.info('Closing page');
      await this.page.close();
    }
  }

  static async closeContext(): Promise<void> {
    if (this.context) {
      logger.info('Closing browser context');
      await this.context.close();
    }
  }

  static async closeBrowser(): Promise<void> {
    if (this.browser) {
      logger.info('Closing browser');
      await this.browser.close();
      this.browser = null as any;
      this.browserLaunchedForFeature = false;
    }
  }

  static async closeBrowserForFeature(): Promise<void> {
    logger.info('Closing browser instance for feature');
    await this.closeBrowser();
    logger.info('Browser instance closed for feature');
  }

  // Capture screenshot on test failure with timestamp
  static async takeScreenshotOnFailure(scenarioName: string): Promise<void> {
    if (environment.get('screenshotOnFailure') && this.page) {
      const screenshotDir = './reports/screenshots';
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${scenarioName.replace(/\s+/g, '_')}_${timestamp}.png`;
      const filepath = path.join(screenshotDir, filename);

      await this.page.screenshot({ path: filepath, fullPage: true });
      logger.info(`Screenshot saved: ${filepath}`);
    }
  }

  // Clean up page and context while keeping browser alive for reuse
  static async cleanupScenario(): Promise<void> {
    logger.info('Cleaning up scenario resources (page and context only)');
    await this.closePage();
    await this.closeContext();
    this.page = null as any;
    this.context = null as any;
    logger.info('Scenario cleanup completed');
  }

  static async cleanup(): Promise<void> {
    logger.info('Cleaning up browser resources');
    await this.closePage();
    await this.closeContext();
    logger.info('Browser cleanup completed');
  }
}
