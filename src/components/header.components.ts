import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

// Header component with navigation and user profile actions
export class HeaderComponent {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('HeaderComponent');
  }

  async waitForHeader(timeout: number = 10000): Promise<void> {
    this.logger.action('Wait for header');
    const header = this.page.locator('header.MuiAppBar-root');
    await header.waitFor({ state: 'visible', timeout });
  }

  async clickBackButton(): Promise<void> {
    this.logger.action('Click back button');
    const backButton = this.page.getByTestId('ChevronLeftIcon');
    await backButton.click();
  }

  async clickSupportIcon(): Promise<void> {
    this.logger.action('Click support icon');
    const supportIcon = this.page.getByAltText('Support');
    await supportIcon.click();
  }

  async clickUserProfileMenu(): Promise<void> {
    this.logger.action('Click user profile menu');
    const profileButton = this.page.getByRole('button', { name: 'more' });
    await profileButton.click();
  }

  async getOrganizationName(): Promise<string> {
    this.logger.action('Get organization name');
    const orgName = this.page.locator('header .flex.items-center.capitalize span');
    return await orgName.textContent() || '';
  }

  async clickOrganizationDropdown(): Promise<void> {
    this.logger.action('Click organization dropdown');
    const orgDropdown = this.page.locator('header .flex.items-center.capitalize.border');
    await orgDropdown.click();
  }

  async isHeaderVisible(): Promise<boolean> {
    const header = this.page.locator('header.MuiAppBar-root');
    return await header.isVisible();
  }

  async isBackButtonVisible(): Promise<boolean> {
    const backButton = this.page.locator('header svg[data-testid="ChevronLeftIcon"]');
    return await backButton.isVisible();
  }

  async getHeaderBackgroundColor(): Promise<string> {
    const toolbar = this.page.locator('header .MuiToolbar-root');
    const bgColor = await toolbar.evaluate((el: any) => {
      return el.ownerDocument.defaultView.getComputedStyle(el).backgroundColor;
    });
    return bgColor;
  }
}
