import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ReportsPage extends BasePage {
  // Static locators initialized in constructor
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

  /**
   * Verify search box is displayed
   */
  async verifySearchBoxDisplayed(): Promise<void> {
    await expect(this.searchBox).toBeVisible();
  }

  /**
   * Verify user list is displayed
   */
  async verifyUserListDisplayed(): Promise<void> {
    await expect(this.userEntries.first()).toBeVisible();
  }

  /**
   * Click view user button
   */
  async clickViewUserButton(): Promise<void> {
    await this.viewUserButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verify user details expanded
   */
  async verifyUserDetailsExpanded(): Promise<void> {
    await expect(this.quarterSelector).toBeVisible();
  }

  /**
   * Get year dropdown
   */
  getYearDropdown(): Locator {
    return this.yearDropdown;
  }

  /**
   * Get stain type heading
   */
  getStainTypeHeading(stainType: string): Locator {
    return this.page.getByRole('heading', { name: stainType, level: 3 });
  }

  /**
   * Get expand buttons
   */
  getExpandButtons(): Locator {
    return this.expandButtons;
  }

  /**
   * Get icons
   */
  getIcons(): Locator {
    return this.icons;
  }

  /**
   * Get label elements
   */
  getLabels(label: string): Locator {
    return this.page.locator(`text=${label}`);
  }

  /**
   * Get first user
   */
  getFirstUser(): Locator {
    return this.firstUser;
  }

  /**
   * Get quarter selector
   */
  getQuarterSelector(): Locator {
    return this.quarterSelector;
  }

  /**
   * Get chart section heading
   */
  getChartSectionHeading(chartName: string): Locator {
    return this.page.getByRole('heading', { name: chartName, level: 6 });
  }

  /**
   * Get metric heading
   */
  getMetricHeading(metricName: string): Locator {
    return this.page.getByRole('heading', { name: metricName, level: 6 });
  }

  /**
   * Get pagination controls
   */
  getPaginationControls(): Locator {
    return this.paginationControls;
  }

  /**
   * Get current page button
   */
  getCurrentPageButton(): Locator {
    return this.currentPageButton;
  }
}
