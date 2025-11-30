import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ModelPage extends BasePage {
  // Static locators initialized in constructor
  private readonly checkboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.checkboxes = page.locator('input[type="checkbox"]');
  }

  /**
   * Get total stainers count
   */
  async getTotalStainersCount(): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    return await this.page.locator('//div[text()="Total Stainers Available"]/following-sibling::div').first().textContent() || '0';
  }

  /**
   * Get tab element
   */
  getTab(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName });
  }

  /**
   * Get metric element
   */
  getMetric(metricName: string): Locator {
    return this.page.locator(`text=${metricName}`);
  }

  /**
   * Get stain element
   */
  getStainElement(stainName: string): Locator {
    return this.page.locator(`text=${stainName}`);
  }

  /**
   * Get stain type element
   */
  getStainTypeElement(stainType: string): Locator {
    return this.page.locator(`text=${stainType}`);
  }

  /**
   * Get version element
   */
  getVersionElement(version: string): Locator {
    return this.page.locator(`text=${version}`);
  }

  /**
   * Get all checkboxes
   */
  getCheckboxes(): Locator {
    return this.checkboxes;
  }

  /**
   * Get stain checkbox by name and version
   */
  getStainCheckbox(stainName: string, version: string): Locator {
    const stainContainer = this.page.locator(`text=${stainName}`).locator('../../..').filter({ hasText: version });
    return stainContainer.locator('input[type="checkbox"]').first();
  }
}
