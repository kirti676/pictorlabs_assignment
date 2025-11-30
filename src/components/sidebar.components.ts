import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

// Sidebar navigation component with menu interactions
export class SidebarComponent {
  private page: Page;
  private logger: Logger;

  private drawer: Locator;
  private logo: Locator;
  private menuItems: Locator;
  private toggleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('SidebarComponent');

    this.drawer = this.page.locator('div.MuiDrawer-root.MuiDrawer-anchorLeft.MuiDrawer-docked');
    this.logo = this.drawer.locator('img[src*="svg"]').first();
    this.menuItems = this.drawer.locator('li.MuiListItem-root');
    this.toggleButton = this.drawer.locator('button[type="button"]', { 
      has: this.page.getByTestId('ChevronRightIcon') 
    });
  }

  async waitForSidebar(timeout: number = 10000): Promise<void> {
    this.logger.action('Wait for sidebar');
    await this.drawer.waitFor({ state: 'visible', timeout });
  }

  async isVisible(): Promise<boolean> {
    this.logger.action('Check if sidebar is visible');
    return await this.drawer.isVisible();
  }

  async clickLogo(): Promise<void> {
    this.logger.action('Click sidebar logo');
    await this.logo.click();
  }

  // Click menu item by text label
  async clickMenuItem(menuText: string): Promise<void> {
    this.logger.action(`Click menu item: ${menuText}`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
  }

  async clickDashboard(): Promise<void> {
    this.logger.action('Click Dashboard menu item');
    await this.clickMenuItem('Dashboard');
  }

  async clickModel(): Promise<void> {
    this.logger.action('Click Model menu item');
    await this.clickMenuItem('Model');
  }

  async clickReports(): Promise<void> {
    this.logger.action('Click Reports menu item');
    await this.clickMenuItem('Reports');
  }

  async clickUploads(): Promise<void> {
    this.logger.action('Click Uploads menu item');
    await this.clickMenuItem('Uploads');
  }

  async isMenuItemActive(menuText: string): Promise<boolean> {
    this.logger.action(`Check if menu item "${menuText}" is active`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    const classAttribute = await menuItem.getAttribute('class');
    return classAttribute?.includes('bg-primary-200') || false;
  }

  async getMenuItemNames(): Promise<string[]> {
    this.logger.action('Get all menu item names');
    const items = await this.drawer.locator('.MuiListItemText-primary').allTextContents();
    return items;
  }

  async getMenuItemCount(): Promise<number> {
    this.logger.action('Get menu item count');
    return await this.menuItems.count();
  }

  async clickToggleButton(): Promise<void> {
    this.logger.action('Click sidebar toggle button');
    await this.toggleButton.waitFor({ state: 'visible' });
    await this.toggleButton.click();
  }

  async clickMenuItemByIndex(index: number): Promise<void> {
    this.logger.action(`Click menu item at index: ${index}`);
    const menuItem = this.menuItems.nth(index);
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
  }

  async isMenuItemIconVisible(menuText: string): Promise<boolean> {
    this.logger.action(`Check if icon is visible for menu item: ${menuText}`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    const icon = menuItem.locator('.MuiListItemIcon-root img');
    return await icon.isVisible();
  }

  async getActiveMenuItem(): Promise<string | null> {
    this.logger.action('Get active menu item');
    const activeItem = this.drawer.locator('.MuiListItem-root.bg-primary-200 .MuiListItemText-primary');
    
    if (await activeItem.count() > 0) {
      return await activeItem.textContent();
    }
    return null;
  }

  async hoverMenuItem(menuText: string): Promise<void> {
    this.logger.action(`Hover over menu item: ${menuText}`);
    const menuItem = this.drawer.locator('.MuiListItem-root', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    await menuItem.hover();
  }

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

  // Wait until menu item shows active state (highlighted)
  async waitForMenuItemActive(menuText: string, timeout: number = 5000): Promise<void> {
    this.logger.action(`Wait for menu item "${menuText}" to be active`);
    const menuItem = this.drawer.locator('.MuiListItem-root.bg-primary-200', {
      has: this.page.locator(`.MuiListItemText-primary:has-text("${menuText}")`)
    });
    await menuItem.waitFor({ state: 'visible', timeout });
  }

  async getSidebarWidth(): Promise<number> {
    this.logger.action('Get sidebar width');
    const boundingBox = await this.drawer.boundingBox();
    return boundingBox?.width || 0;
  }

  async isToggleButtonVisible(): Promise<boolean> {
    this.logger.action('Check if toggle button is visible');
    return await this.toggleButton.isVisible();
  }

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
      if (!actualMenuItems.includes(menuItem)) {
        this.logger.error(`Menu item "${menuItem}" not found in sidebar`);
        missingMenuItems.push(menuItem);
        continue;
      }

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
