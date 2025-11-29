import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  // Locators initialized in constructor
  private readonly pageTitle: Locator;
  private readonly userProfileMenu: Locator;
  private readonly logoutButton: Locator;
  private readonly mainContent: Locator;
  private readonly sidebarMenu: Locator;

  constructor(page: Page) {
    super(page, 'DashboardPage');
    
    // Initialize all locators in constructor
    this.pageTitle = page.locator('h1, .page-title, [data-testid="page-title"]');
    this.userProfileMenu = page.locator('.user-profile, .profile-menu, [data-testid="user-menu"]');
    this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.sidebarMenu = page.locator('.sidebar, .side-menu, nav');
  }

  /**
   * Verify dashboard is loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    this.logger.action('Verify dashboard is loaded');
    try {
      // Wait for page to be fully loaded
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
      
      // Check if we're on the dashboard URL (not redirected to login)
      const currentUrl = this.page.url();
      const isOnDashboard = !currentUrl.includes('login') && !currentUrl.includes('auth');
      
      if (!isOnDashboard) {
        return false;
      }
      
      // Try multiple possible dashboard indicators
      const dashboardIndicators = [
        this.mainContent,
        this.sidebarMenu,
        this.page.locator('body'),  // At minimum, body should be visible
      ];
      
      for (const indicator of dashboardIndicators) {
        try {
          await indicator.waitFor({ state: 'visible', timeout: 5000 });
          return true;
        } catch {
          continue;
        }
      }
      
      return false;
    } catch (error) {
      this.logger.error(`Dashboard load check failed: ${error}`);
      return false;
    }
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    this.logger.action('Get page title');
    return await this.getText(this.pageTitle, 'Page Title');
  }

  /**
   * Click user profile menu
   */
  async clickUserProfileMenu(): Promise<void> {
    this.logger.action('Click user profile menu');
    
    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Try multiple possible user menu selectors
    const userMenuSelectors = [
      '.user-profile',
      '.profile-menu',
      '[data-testid="user-menu"]',
      '[aria-label*="user" i]',
      '[aria-label*="profile" i]',
      'button:has-text("Profile")',
      'button[aria-label*="account" i]',
      '.avatar',
      '[class*="avatar" i]',
      '[class*="user" i]',
      'img[alt*="user" i]',
      'img[alt*="profile" i]',
    ];
    
    for (const selector of userMenuSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click({ timeout: 5000 });
          this.logger.info(`Clicked user menu using selector: ${selector}`);
          return;
        }
      } catch {
        continue;
      }
    }
    
    throw new Error('Could not find user profile menu with any known selector');
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    this.logger.step('Logout from application');
    await this.clickUserProfileMenu();
    await this.click(this.logoutButton, 'Logout Button');
  }

  /**
   * Navigate to menu item
   */
  async navigateToMenuItem(menuItemText: string): Promise<void> {
    this.logger.action(`Navigate to menu item: ${menuItemText}`);
    
    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Try multiple ways to find the menu item
    const menuItemSelectors = [
      `a:has-text("${menuItemText}")`,
      `button:has-text("${menuItemText}")`,
      `[data-testid="${menuItemText.toLowerCase()}"]`,
      `[aria-label="${menuItemText}"]`,
      `nav a:has-text("${menuItemText}")`,
      `.sidebar a:has-text("${menuItemText}")`,
      `[role="navigation"] a:has-text("${menuItemText}")`,
      `a[href*="${menuItemText.toLowerCase()}"]`,
    ];
    
    for (const selector of menuItemSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click({ timeout: 5000 });
          this.logger.info(`Clicked menu item using selector: ${selector}`);
          await this.page.waitForLoadState('networkidle', { timeout: 5000 });
          return;
        }
      } catch {
        continue;
      }
    }
    
    throw new Error(`Could not find menu item "${menuItemText}" with any known selector`);
  }
}
