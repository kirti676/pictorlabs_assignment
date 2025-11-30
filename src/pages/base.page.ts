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

  async type(locator: Locator, text: string, elementName?: string): Promise<void> {
    this.logger.action(`Type text: "${text}"`, elementName);
    await locator.waitFor({ state: 'visible' });
    await locator.type(text);
  }

  async getText(locator: Locator, elementName?: string): Promise<string> {
    this.logger.action('Get text', elementName);
    await locator.waitFor({ state: 'visible' });
    const text = await locator.textContent() || '';
    this.logger.info(`Retrieved text: "${text}"`);
    return text;
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

  async waitForElementHidden(locator: Locator, timeout: number = 10000, elementName?: string): Promise<void> {
    this.logger.action(`Wait for element to be hidden (timeout: ${timeout}ms)`, elementName);
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async selectOption(locator: Locator, option: string | { label: string } | { value: string }, elementName?: string): Promise<void> {
    this.logger.action(`Select option`, elementName);
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(option);
  }

  async check(locator: Locator, elementName?: string): Promise<void> {
    this.logger.action('Check', elementName);
    await locator.waitFor({ state: 'visible' });
    await locator.check();
  }

  async uncheck(locator: Locator, elementName?: string): Promise<void> {
    this.logger.action('Uncheck', elementName);
    await locator.waitFor({ state: 'visible' });
    await locator.uncheck();
  }

  async pressKey(key: string): Promise<void> {
    this.logger.action(`Press key: ${key}`);
    await this.page.keyboard.press(key);
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    this.logger.action(`Taking screenshot: ${name}`);
    return await this.page.screenshot({ path: `./reports/screenshots/${name}.png`, fullPage: true });
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

  async waitForNavigation(timeout: number = 30000): Promise<void> {
    this.logger.action('Wait for navigation');
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async reload(): Promise<void> {
    this.logger.action('Reload page');
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    this.logger.action('Go back');
    await this.page.goBack();
  }

  async hover(locator: Locator, elementName?: string): Promise<void> {
    this.logger.action('Hover', elementName);
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }
}
