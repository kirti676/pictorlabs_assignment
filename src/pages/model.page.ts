import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

// Model page for managing stainers and configurations
export class ModelPage extends BasePage {
  private readonly checkboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.checkboxes = page.locator('input[type="checkbox"]');
  }

  async getTotalStainersCount(): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    return await this.page.locator('//div[text()="Total Stainers Available"]/following-sibling::div').first().textContent() || '0';
  }

  getTab(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName });
  }

  getMetric(metricName: string): Locator {
    return this.page.locator(`text=${metricName}`);
  }

  getStainElement(stainName: string): Locator {
    return this.page.locator(`text=${stainName}`);
  }

  getStainTypeElement(stainType: string): Locator {
    return this.page.locator(`text=${stainType}`);
  }

  getVersionElement(version: string): Locator {
    return this.page.locator(`text=${version}`);
  }

  getCheckboxes(): Locator {
    return this.checkboxes;
  }

  getStainCheckbox(stainName: string, version: string): Locator {
    const stainContainer = this.page.locator(`text=${stainName}`).locator('../../..').filter({ hasText: version });
    return stainContainer.locator('input[type="checkbox"]').first();
  }
}
