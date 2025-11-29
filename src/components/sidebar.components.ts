import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Sidebar Navigation Component - Reusable component for MUI Drawer sidebar interactions
 */
export class SidebarComponent {
  private page: Page;
  private logger: Logger;

  // Main drawer locators
  private drawer: Locator;
  private logo: Locator;
  private menuItems: Locator;
  private toggleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('SidebarComponent');

    // Initialize locators
    this.drawer = this.page.locator('div.MuiDrawer-root.MuiDrawer-anchorLeft.MuiDrawer-docked');
    this.logo = this.drawer.locator('img[src*="svg"]').first();
    this.menuItems = this.drawer.locator('li.MuiListItem-root');
    this.toggleButton = this.drawer.locator('button[type="button"]', { 
      has: this.page.getByTestId('ChevronRightIcon') 
    });
  }

  /**
   * Wait for sidebar to be visible
   */
  async waitForSidebar(timeout: number = 10000): Promise<void> {
    this.logger.action('Wait for sidebar');
    await this.drawer.waitFor({ state: 'visible', timeout });
  }

  /**
   * Verify sidebar is visible
   */
  async isVisible(): Promise<boolean> {
    this.logger.action('Check if sidebar is visible');
    return await this.drawer.isVisible();
  }

  /**
   * Click on logo
   */
  async clickLogo(): Promise<void> {
    this.logger.action('Click sidebar logo');
    await this.logo.click();
  }

  /**
   * Click on menu item by text
   */
  async clickMenuItem(menuText: string): Promise<void> {
    this.logger.action(`Click menu item: ${menuText}`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
  }

  /**
   * Click Dashboard menu item
   */
  async clickDashboard(): Promise<void> {
    this.logger.action('Click Dashboard menu item');
    await this.clickMenuItem('Dashboard');
  }

  /**
   * Click Model menu item
   */
  async clickModel(): Promise<void> {
    this.logger.action('Click Model menu item');
    await this.clickMenuItem('Model');
  }

  /**
   * Click Reports menu item
   */
  async clickReports(): Promise<void> {
    this.logger.action('Click Reports menu item');
    await this.clickMenuItem('Reports');
  }

  /**
   * Click Uploads menu item
   */
  async clickUploads(): Promise<void> {
    this.logger.action('Click Uploads menu item');
    await this.clickMenuItem('Uploads');
  }

  /**
   * Check if menu item is active/selected
   */
  async isMenuItemActive(menuText: string): Promise<boolean> {
    this.logger.action(`Check if menu item "${menuText}" is active`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    const classAttribute = await menuItem.getAttribute('class');
    return classAttribute?.includes('bg-primary-200') || false;
  }

  /**
   * Get all menu item names
   */
  async getMenuItemNames(): Promise<string[]> {
    this.logger.action('Get all menu item names');
    const items = await this.drawer.locator('.MuiListItemText-primary').allTextContents();
    return items;
  }

  /**
   * Get count of menu items
   */
  async getMenuItemCount(): Promise<number> {
    this.logger.action('Get menu item count');
    return await this.menuItems.count();
  }

  /**
   * Click toggle/collapse button
   */
  async clickToggleButton(): Promise<void> {
    this.logger.action('Click sidebar toggle button');
    await this.toggleButton.waitFor({ state: 'visible' });
    await this.toggleButton.click();
  }

  /**
   * Get menu item by index (0-based)
   */
  async clickMenuItemByIndex(index: number): Promise<void> {
    this.logger.action(`Click menu item at index: ${index}`);
    const menuItem = this.menuItems.nth(index);
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
  }

  /**
   * Verify menu item icon is visible
   */
  async isMenuItemIconVisible(menuText: string): Promise<boolean> {
    this.logger.action(`Check if icon is visible for menu item: ${menuText}`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    const icon = menuItem.locator('.MuiListItemIcon-root img');
    return await icon.isVisible();
  }

  /**
   * Get the current active menu item
   */
  async getActiveMenuItem(): Promise<string | null> {
    this.logger.action('Get active menu item');
    const activeItem = this.drawer.locator('.MuiListItem-root.bg-primary-200 .MuiListItemText-primary');
    
    if (await activeItem.count() > 0) {
      return await activeItem.textContent();
    }
    return null;
  }

  /**
   * Hover over menu item
   */
  async hoverMenuItem(menuText: string): Promise<void> {
    this.logger.action(`Hover over menu item: ${menuText}`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    await menuItem.hover();
  }

  /**
   * Verify all expected menu items are present
   */
  async verifyAllMenuItems(expectedItems: string[]): Promise<boolean> {
    this.logger.action('Verify all menu items are present');
    const actualItems = await this.getMenuItemNames();
    
    for (const expected of expectedItems) {
      if (!actualItems.includes(expected)) {
        this.logger.error(`Menu item "${expected}" not found`);
        return false;
      }
    }
    return true;
  }

  /**
   * Wait for menu item to be active
   */
  async waitForMenuItemActive(menuText: string, timeout: number = 5000): Promise<void> {
    this.logger.action(`Wait for menu item "${menuText}" to be active`);
    const menuItem = this.drawer.locator('.MuiListItem-root.bg-primary-200', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    await menuItem.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get sidebar width
   */
  async getSidebarWidth(): Promise<number> {
    this.logger.action('Get sidebar width');
    const boundingBox = await this.drawer.boundingBox();
    return boundingBox?.width || 0;
  }

  /**
   * Check if toggle button is visible
   */
  async isToggleButtonVisible(): Promise<boolean> {
    this.logger.action('Check if toggle button is visible');
    return await this.toggleButton.isVisible();
  }

  /**
   * Validate that each menu item has a visible icon
   * @returns Object with validation results for each menu item
   */
  async validateAllMenuItemIcons(): Promise<{ isValid: boolean; results: Array<{ menuItem: string; hasIcon: boolean }> }> {
    this.logger.action('Validate all menu item icons');
    
    const menuItemNames = await this.getMenuItemNames();
    const results: Array<{ menuItem: string; hasIcon: boolean }> = [];
    let allValid = true;

    for (const menuName of menuItemNames) {
      const hasIcon = await this.isMenuItemIconVisible(menuName);
      results.push({ menuItem: menuName, hasIcon });
      
      if (!hasIcon) {
        this.logger.error(`Menu item "${menuName}" does not have a visible icon`);
        allValid = false;
      }
    }

    this.logger.info(`Icon validation complete. All valid: ${allValid}`);
    return { isValid: allValid, results };
  }

  /**
   * Get icon source URL for a specific menu item
   * @param menuText The text of the menu item
   * @returns The icon src attribute or null if not found
   */
  async getMenuItemIconSrc(menuText: string): Promise<string | null> {
    this.logger.action(`Get icon source for menu item: ${menuText}`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    const icon = menuItem.locator('.MuiListItemIcon-root img');
    
    if (await icon.isVisible()) {
      return await icon.getAttribute('src');
    }
    return null;
  }

  /**
   * Validate icon presence for a list of expected menu items
   * @param expectedMenuItems Array of menu item names to validate
   * @returns Object with validation status and details
   */
  async validateMenuItemsWithIcons(expectedMenuItems: string[]): Promise<{ 
    isValid: boolean; 
    missingIcons: string[];
    missingMenuItems: string[];
  }> {
    this.logger.action('Validate specific menu items have icons');
    
    const missingIcons: string[] = [];
    const missingMenuItems: string[] = [];
    const actualMenuItems = await this.getMenuItemNames();

    for (const menuItem of expectedMenuItems) {
      // Check if menu item exists
      if (!actualMenuItems.includes(menuItem)) {
        this.logger.error(`Menu item "${menuItem}" not found in sidebar`);
        missingMenuItems.push(menuItem);
        continue;
      }

      // Check if icon is visible
      const hasIcon = await this.isMenuItemIconVisible(menuItem);
      if (!hasIcon) {
        this.logger.error(`Menu item "${menuItem}" does not have a visible icon`);
        missingIcons.push(menuItem);
      }
    }

    const isValid = missingIcons.length === 0 && missingMenuItems.length === 0;
    this.logger.info(`Validation complete. Valid: ${isValid}`);
    
    return { isValid, missingIcons, missingMenuItems };
  }
}
