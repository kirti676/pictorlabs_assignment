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

  getDescription(description: string): Locator {
    return this.page.locator(`text=${description}`);
  }

  getStatus(statusName: string): Locator {
    return this.page.locator(`text=${statusName}`);
  }

  getChartArea(): Locator {
    return this.chartArea;
  }

  getIcons(): Locator {
    return this.page.locator('img');
  }

  async selectQuarter(quarterText: string): Promise<void> {
    this.logger.action(`Selecting quarter: ${quarterText}`);
    
    try {
      const stainUsageCard = this.page.locator('div:has-text("Stain Usage Overview")').first();
      const oldChartContent = await stainUsageCard.textContent().catch(() => '');
      
      await this.quarterDropdown.click({ timeout: 5000 });
      await this.page.locator('[role="option"]').first().waitFor({ state: 'visible', timeout: 5000 });
      
      // Try multiple selector strategies
      try {
        await this.page.getByRole('option', { name: quarterText }).click({ timeout: 5000 });
        this.logger.info(`Selected quarter using role selector: ${quarterText}`);
      } catch {
        try {
          await this.page.locator(`text="${quarterText}"`).first().click({ timeout: 5000 });
          this.logger.info(`Selected quarter using text selector: ${quarterText}`);
        } catch {
          await this.page.locator(`text=/.*${quarterText.substring(0, 15)}.*/`).first().click({ timeout: 5000 });
          this.logger.info(`Selected quarter using partial text selector: ${quarterText}`);
        }
      }
      
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Poll for chart content change
      try {
        let contentChanged = false;
        const startTime = Date.now();
        const timeout = 5000;
        
        while (Date.now() - startTime < timeout && !contentChanged) {
          const newChartContent = await stainUsageCard.textContent().catch(() => '');
          if (newChartContent && newChartContent !== oldChartContent && newChartContent.length > 0) {
            contentChanged = true;
            this.logger.info('Chart content has changed, update complete');
            break;
          }
          await this.page.evaluate(() => new Promise(resolve => setTimeout(resolve, 300)));
        }
        
        if (!contentChanged) {
          this.logger.warn('Chart content did not change within expected time');
        }
      } catch (error) {
        this.logger.warn(`Error waiting for chart content change: ${error}`);
      }
    } catch (error) {
      this.logger.error(`Error selecting quarter ${quarterText}: ${error}`);
      await this.page.keyboard.press('Escape');
      throw error;
    }
  }

  async getChartMonths(): Promise<string[]> {
    this.logger.action('Extracting months from chart area');
    
    const stainUsageCard = this.page.locator('div:has-text("Stain Usage Overview")').first();
    await stainUsageCard.locator('svg').first().waitFor({ state: 'visible', timeout: 5000 });
    
    const months: string[] = [];
    const monthPattern = /\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/gi;
    
    try {
      // Extract months from SVG text elements
      const svgTexts = await stainUsageCard.locator('svg text, svg tspan, svg >> text=/.*/').all();
      this.logger.info(`Found ${svgTexts.length} SVG text elements in chart area`);
      
      for (const text of svgTexts) {
        try {
          const content = await text.textContent({ timeout: 1000 });
          if (content) {
            const trimmed = content.trim().toUpperCase();
            const monthMatches = trimmed.match(monthPattern);
            if (monthMatches) {
              for (const match of monthMatches) {
                const monthUpper = match.toUpperCase();
                if (!months.includes(monthUpper)) {
                  months.push(monthUpper);
                  this.logger.info(`Found month in SVG: ${monthUpper}`);
                }
              }
            }
          }
        } catch (e) {
          // Skip unreadable elements
        }
      }
      
      // Fallback: search all text content
      if (months.length < 2) {
        this.logger.info('Trying additional methods to find months');
        
        const allTextElements = await stainUsageCard.locator('*').allTextContents();
        for (const textContent of allTextElements) {
          const monthMatches = textContent.match(monthPattern);
          if (monthMatches) {
            for (const match of monthMatches) {
              const monthUpper = match.toUpperCase();
              if (!months.includes(monthUpper)) {
                months.push(monthUpper);
                this.logger.info(`Found month in text content: ${monthUpper}`);
              }
            }
          }
        }
      }
      
      // Last resort: search entire page
      if (months.length === 0) {
        this.logger.warn('No months found in chart area, checking entire page');
        const pageContent = await this.page.content();
        const matches = pageContent.match(monthPattern);
        if (matches) {
          const uniqueMonths = [...new Set(matches.map(m => m.toUpperCase()))];
          months.push(...uniqueMonths);
          this.logger.info(`Found months in page content: ${uniqueMonths.join(', ')}`);
        }
      }
      
      const uniqueMonths = [...new Set(months)];
      this.logger.info(`Total unique months found: ${uniqueMonths.join(', ')}`);
      
      return uniqueMonths;
    } catch (error) {
      this.logger.error(`Error extracting months from chart: ${error}`);
      return months;
    }
  }

  async getAllAvailableQuarters(): Promise<string[]> {
    this.logger.action('Getting all available quarters from dropdown');
    
    await this.quarterDropdown.click();
    await this.page.locator('[role="option"]').first().waitFor({ state: 'visible', timeout: 5000 });
    
    const quarters: string[] = [];
    
    try {
      const options = await this.page.locator('[role="option"]').all();
      
      for (const option of options) {
        const text = await option.textContent();
        if (text && text.trim()) {
          quarters.push(text.trim());
        }
      }
      
      this.logger.info(`Found ${quarters.length} quarters in dropdown: ${quarters.join(', ')}`);
    } catch (error) {
      this.logger.warn('Could not get quarters using role selector, trying alternative method');
      
      // Fallback: search listbox/menu options
      const menuOptions = await this.page.locator('[role="listbox"] > *, [role="menu"] > *').all();
      
      for (const option of menuOptions) {
        const text = await option.textContent();
        if (text && text.trim() && text.includes('Q')) {
          quarters.push(text.trim());
        }
      }
      
      this.logger.info(`Found ${quarters.length} quarters using alternative method: ${quarters.join(', ')}`);
    }
    
    await this.page.keyboard.press('Escape');
    await this.page.locator('[role="option"]').first().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    
    return quarters;
  }
}
