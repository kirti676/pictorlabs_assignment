import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

// Base page with common interactions and wait utilities
export class BasePage {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page, context: string = 'BasePage') {
    this.page = page;
    this.logger = new Logger(context);
  }

  async navigate(url: string): Promise<void> {
    this.logger.action(`Navigating to URL: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  async click(locator: Locator, elementName?: string): Promise<void> {
    this.logger.action('Click', elementName);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, text: string, elementName?: string): Promise<void> {
    this.logger.action(`Fill text: "${text}"`, elementName);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  async getInnerText(locator: Locator, elementName?: string): Promise<string> {
    this.logger.action('Get text', elementName);
    await locator.waitFor({ state: 'visible' });
    const text = await locator.innerText() || '';
    this.logger.info(`Retrieved text: "${text}"`);
    return text;
  }

  async isVisible(locator: Locator, elementName?: string): Promise<boolean> {
    this.logger.action('Check visibility', elementName);
    const visible = await locator.isVisible();
    this.logger.info(`Element visibility: ${visible}`);
    return visible;
  }

  async waitForElement(locator: Locator, timeout: number = 10000, elementName?: string): Promise<void> {
    this.logger.action(`Wait for element (timeout: ${timeout}ms)`, elementName);
    await locator.waitFor({ state: 'visible', timeout });
  }

  async getTitle(): Promise<string> {
    const title = await this.page.title();
    this.logger.info(`Page title: ${title}`);
    return title;
  }

  async getCurrentUrl(): Promise<string> {
    const url = this.page.url();
    this.logger.info(`Current URL: ${url}`);
    return url;
  }

}
