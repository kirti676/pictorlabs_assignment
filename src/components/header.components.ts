import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Header Component - Reusable component for MUI AppBar header interactions
 */
export class HeaderComponent {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('HeaderComponent');
  }

  /**
   * Wait for header to be visible
   */
  async waitForHeader(timeout: number = 10000): Promise<void> {
    this.logger.action('Wait for header');
    const header = this.page.locator('header.MuiAppBar-root');
    await header.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click back/chevron button
   */
  async clickBackButton(): Promise<void> {
    this.logger.action('Click back button');
    const backButton = this.page.getByTestId('ChevronLeftIcon');
    await backButton.click();
  }

  /**
   * Click logo
   */
  async clickSupportIcon(): Promise<void> {
    this.logger.action('Click support icon');
    const supportIcon = this.page.getByAltText('Support');
    await supportIcon.click();
  }

  /**
   * Click user profile menu
   */
  async clickUserProfileMenu(): Promise<void> {
    this.logger.action('Click user profile menu');
    const profileButton = this.page.getByRole('button', { name: 'more' });
    await profileButton.click();
  }

  /**
   * Get organization name from dropdown
   */
  async getOrganizationName(): Promise<string> {
    this.logger.action('Get organization name');
    const orgName = this.page.locator('header .flex.items-center.capitalize span');
    return await orgName.textContent() || '';
  }

  /**
   * Click organization dropdown
   */
  async clickOrganizationDropdown(): Promise<void> {
    this.logger.action('Click organization dropdown');
    const orgDropdown = this.page.locator('header .flex.items-center.capitalize.border');
    await orgDropdown.click();
  }

  /**
   * Is header visible
   */
  async isHeaderVisible(): Promise<boolean> {
    const header = this.page.locator('header.MuiAppBar-root');
    return await header.isVisible();
  }

  /**
   * Is back button visible
   */
  async isBackButtonVisible(): Promise<boolean> {
    const backButton = this.page.locator('header svg[data-testid="ChevronLeftIcon"]');
    return await backButton.isVisible();
  }

  /**
   * Get header background color
   */
  async getHeaderBackgroundColor(): Promise<string> {
    const toolbar = this.page.locator('header .MuiToolbar-root');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bgColor = await toolbar.evaluate((el: any) => {
      return el.ownerDocument.defaultView.getComputedStyle(el).backgroundColor;
    });
    return bgColor;
  }
}
