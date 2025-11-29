import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { environment } from '../config/environment';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const logger = new Logger('BrowserManager');

export class BrowserManager {
  private static browser: Browser;
  private static context: BrowserContext;
  private static page: Page;

  /**
   * Launch browser
   */
  static async launchBrowser(browserType?: 'chromium' | 'firefox' | 'webkit'): Promise<Browser> {
    const selectedBrowser = browserType || environment.get('browser');
    logger.info(`Launching browser: ${selectedBrowser}`);

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

    logger.info('Browser launched successfully');
    return this.browser;
  }

  /**
   * Create browser context
   */
  static async createContext(options?: any): Promise<BrowserContext> {
    logger.info('Creating browser context');
    
    const contextOptions = {
      viewport: null, // Use full screen
      recordVideo: environment.get('videoOnFailure') ? {
        dir: './reports/videos/',
      } : undefined,
      ...options,
    };

    this.context = await this.browser.newContext(contextOptions);
    logger.info('Browser context created successfully');
    return this.context;
  }

  /**
   * Create new page
   */
  static async createPage(): Promise<Page> {
    logger.info('Creating new page');
    
    if (!this.context) {
      await this.createContext();
    }

    this.page = await this.context.newPage();
    
    // Set default timeout
    this.page.setDefaultTimeout(environment.get('timeout'));
    
    logger.info('New page created successfully');
    return this.page;
  }

  /**
   * Get current page
   */
  static getPage(): Page {
    if (!this.page) {
      throw new Error('Page not initialized. Call createPage() first.');
    }
    return this.page;
  }

  /**
   * Get current context
   */
  static getContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Context not initialized. Call createContext() first.');
    }
    return this.context;
  }

  /**
   * Get current browser
   */
  static getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call launchBrowser() first.');
    }
    return this.browser;
  }

  /**
   * Close page
   */
  static async closePage(): Promise<void> {
    if (this.page) {
      logger.info('Closing page');
      await this.page.close();
    }
  }

  /**
   * Close context
   */
  static async closeContext(): Promise<void> {
    if (this.context) {
      logger.info('Closing browser context');
      await this.context.close();
    }
  }

  /**
   * Close browser
   */
  static async closeBrowser(): Promise<void> {
    if (this.browser) {
      logger.info('Closing browser');
      await this.browser.close();
    }
  }

  /**
   * Take screenshot on failure
   */
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

  /**
   * Cleanup all browser resources
   */
  static async cleanup(): Promise<void> {
    logger.info('Cleaning up browser resources');
    await this.closePage();
    await this.closeContext();
    await this.closeBrowser();
    logger.info('Browser cleanup completed');
  }
}
