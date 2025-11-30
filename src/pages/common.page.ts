import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CommonPage extends BasePage {
  constructor(page: Page) {
    super(page, 'CommonPage');
  }

  // Tab locators
  getTab(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName });
  }

  // Heading locators
  getHeading(headingText: string): Locator {
    return this.page.getByRole('heading', { name: headingText });
  }

  // Section heading locators (h6)
  getSectionHeading(sectionName: string): Locator {
    return this.page.getByRole('heading', { name: sectionName, level: 6 });
  }

  // Button locators
  getButton(buttonName: string): Locator {
    return this.page.getByRole('button', { name: buttonName });
  }

  // Text locators
  getTextElement(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  // Search box locator
  getSearchBoxByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  // Generic element locator (tries button, tab, then text)
  async getElement(elementName: string): Promise<Locator> {
    let element = this.page.getByRole('button', { name: elementName });
    let isVisible = await element.isVisible().catch(() => false);
    
    if (!isVisible) {
      element = this.page.getByRole('tab', { name: elementName });
      isVisible = await element.isVisible().catch(() => false);
    }
    
    if (!isVisible) {
      element = this.page.locator(`text=${elementName}`).first();
    }
    
    return element;
  }

  // Actions
  async clickTab(tabName: string): Promise<void> {
    const tab = this.getTab(tabName);
    await this.click(tab, `Tab: ${tabName}`);
    await tab.waitFor({ state: 'attached' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickButton(buttonName: string): Promise<void> {
    const button = this.getButton(buttonName);
    await this.click(button, `Button: ${buttonName}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickElement(elementName: string): Promise<void> {
    const element = await this.getElement(elementName);
    await element.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToTab(tabName: string): Promise<void> {
    const tab = this.getTab(tabName);
    const isSelected = await tab.getAttribute('aria-selected');
    
    if (isSelected !== 'true') {
      await this.clickTab(tabName);
    }
  }

}
