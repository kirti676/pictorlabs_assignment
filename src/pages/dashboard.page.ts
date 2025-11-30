import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

// Dashboard page with metrics, charts, and data visualization
export class DashboardPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly userProfileMenu: Locator;
  private readonly logoutButton: Locator;
  private readonly sidebarMenu: Locator;
  
  private readonly organizationActivityHeading: Locator;
  private readonly slideOverviewHeading: Locator;
  private readonly stainUsageOverviewHeading: Locator;
  private readonly quarterDropdown: Locator;
  private readonly quarterDropdownButton: Locator;
  private readonly chartArea: Locator;
  private readonly searchBox: Locator;
  private readonly overrideButton: Locator;
  private readonly filterButton: Locator;
  private readonly filterMenu: Locator;
  private readonly slidesTable: Locator;
  private readonly projectsTable: Locator;
  private readonly progressBar: Locator;

  constructor(page: Page) {
    super(page, 'DashboardPage');
    
    this.pageTitle = page.locator('h1, .page-title, [data-testid="page-title"]');
    this.userProfileMenu = page.locator('.user-profile, .profile-menu, [data-testid="user-menu"]');
    this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]');
    this.sidebarMenu = page.locator('.sidebar, .side-menu, nav');
    
    this.organizationActivityHeading = page.getByRole('heading', { name: 'Organization Activity' });
    this.slideOverviewHeading = page.getByRole('heading', { name: 'Slide Overview' });
    this.stainUsageOverviewHeading = page.getByRole('heading', { name: 'Stain Usage Overview' });
    this.quarterDropdown = page.locator('[role="combobox"]').first();
    this.quarterDropdownButton = page.getByRole('button', { name: 'Apply' });
    this.chartArea = page.locator('img').filter({ hasNot: page.locator('img[alt=""]') });
    this.searchBox = page.getByPlaceholder('Search');
    this.overrideButton = page.getByRole('button', { name: 'Override' });
    this.filterButton = page.getByRole('button', { name: 'Filter' });
    this.filterMenu = page.locator('[role="menu"]');
    this.slidesTable = page.locator('table, [role="table"]');
    this.projectsTable = page.locator('table, [role="table"]');
    this.progressBar = page.locator('[role="progressbar"]');
  }

  // Verify dashboard is fully loaded by checking URL and visible elements
  async isDashboardLoaded(): Promise<boolean> {
    this.logger.action('Verify dashboard is loaded');
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
      
      const currentUrl = this.page.url();
      const isOnDashboard = !currentUrl.includes('login') && !currentUrl.includes('auth');
      
      if (!isOnDashboard) {
        return false;
      }
      
      // Check multiple indicators to confirm dashboard load
      const dashboardIndicators = [
        this.page.locator('main, .main-content, [role="main"]'),
        this.sidebarMenu,
        this.page.locator('body'),
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

  async getPageTitle(): Promise<string> {
    this.logger.action('Get page title');
    return await this.getText(this.pageTitle, 'Page Title');
  }

  async clickUserProfileMenu(): Promise<void> {
    this.logger.action('Click user profile menu');
    
    await this.page.waitForLoadState('networkidle');
    
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

  async logout(): Promise<void> {
    this.logger.step('Logout from application');
    await this.clickUserProfileMenu();
    await this.click(this.logoutButton, 'Logout Button');
  }

  async navigateToMenuItem(menuItemText: string): Promise<void> {
    this.logger.action(`Navigate to menu item: ${menuItemText}`);
    
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
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

  getHeading(headingName: string): Locator {
    return this.page.getByRole('heading', { name: headingName });
  }

  getCard(cardName: string): Locator {
    return this.page.getByRole('heading', { name: cardName });
  }

  getIcon(iconType: string): Locator {
    return this.page.locator(`img[alt="${iconType}"], img`).first();
  }

  getMetric(metricName: string): Locator {
    return this.page.locator(`text=${metricName}`);
  }

  getMetricCounts(): Locator {
    return this.page.getByRole('heading', { level: 6 }).filter({ hasText: /^\d+$/ });
  }

  getQualityLabel(labelName: string): Locator {
    return this.page.locator(`//*[text()="${labelName}"]`);
  }

  getProgressBar(): Locator {
    return this.progressBar;
  }

  getStainType(stainType: string): Locator {
    return this.page.locator(`text=${stainType}`);
  }

  getButton(buttonName: string): Locator {
    return this.page.getByRole('button', { name: buttonName });
  }

  getTab(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName });
  }

  getSearchBox(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  getTableColumn(columnName: string): Locator {
    if (columnName === 'Checkbox') {
      return this.page.locator('input[type="checkbox"]');
    }
    return this.page.locator(`text=${columnName}`);
  }

  getSortableColumn(columnName: string): Locator {
    return this.page.getByRole('button', { name: columnName });
  }

  getFilterMenu(): Locator {
    return this.filterMenu;
  }

  getFilterOption(optionName: string): Locator {
    return this.page.locator(`//ul[@role="menu"]//*[text()="${optionName}"]`);
  }

  getQuarterDropdown(): Locator {
    return this.quarterDropdown;
  }

  getMonthLabel(month: string): Locator {
    return this.page.locator(`text=${month}`);
  }

  getDescription(description: string): Locator {
    return this.page.locator(`text=${description}`);
  }

  getStatus(statusName: string): Locator {
    return this.page.locator(`text=${statusName}`);
  }

  getChartArea(): Locator {
    return this.chartArea;
  }

  getCounts(): Locator {
    return this.page.getByRole('heading', { level: 5 });
  }

  getIcons(): Locator {
    return this.page.locator('img');
  }
}
