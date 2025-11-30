import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

// Reports page for viewing user activity and stain usage
export class ReportsPage extends BasePage {
  private readonly yearDropdown: Locator;
  private readonly searchBox: Locator;
  private readonly viewUserButton: Locator;
  private readonly userEntries: Locator;
  private readonly quarterSelector: Locator;
  private readonly expandButtons: Locator;
  private readonly icons: Locator;
  private readonly firstUser: Locator;
  private readonly paginationControls: Locator;
  private readonly currentPageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.yearDropdown = page.locator('text=Year').locator('..').locator('[role="combobox"]');
    this.searchBox = page.getByPlaceholder('Search by name or email');
    this.viewUserButton = page.getByRole('button', { name: 'View User' }).first();
    this.userEntries = page.locator('[class*="user"], p:has-text("@pictorlabs.ai")');
    this.quarterSelector = page.locator('text=Quarter').locator('..').locator('[role="combobox"]');
    this.expandButtons = page.locator('button').filter({ hasText: /Immunohistochemistry|Hematoxylin and Eosin|Special Stain/ });
    this.icons = page.locator('img').filter({ hasNot: page.locator('img[alt=""]') });
    this.firstUser = page.locator('p:has-text("@pictorlabs.ai")').first();
    this.paginationControls = page.locator('button').filter({ hasText: '1' });
    this.currentPageButton = page.locator('button:has-text("1")');
  }

  async verifySearchBoxDisplayed(): Promise<void> {
    await expect(this.searchBox).toBeVisible();
  }

  async verifyUserListDisplayed(): Promise<void> {
    await expect(this.userEntries.first()).toBeVisible();
  }

  async clickViewUserButton(): Promise<void> {
    await this.viewUserButton.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyUserDetailsExpanded(): Promise<void> {
    await expect(this.quarterSelector).toBeVisible();
  }

  getYearDropdown(): Locator {
    return this.yearDropdown;
  }

  getStainTypeHeading(stainType: string): Locator {
    return this.page.getByRole('heading', { name: stainType, level: 3 });
  }

  getExpandButtons(): Locator {
    return this.expandButtons;
  }

  getIcons(): Locator {
    return this.icons;
  }

  getLabels(label: string): Locator {
    return this.page.locator(`text=${label}`);
  }

  getFirstUser(): Locator {
    return this.firstUser;
  }

  getQuarterSelector(): Locator {
    return this.quarterSelector;
  }

  getChartSectionHeading(chartName: string): Locator {
    return this.page.getByRole('heading', { name: chartName, level: 6 });
  }

  getMetricHeading(metricName: string): Locator {
    return this.page.getByRole('heading', { name: metricName, level: 6 });
  }

  getPaginationControls(): Locator {
    return this.paginationControls;
  }

  getCurrentPageButton(): Locator {
    return this.currentPageButton;
  }
}
