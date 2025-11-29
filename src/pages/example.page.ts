import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Example Page demonstrating advanced Page Object Model patterns
 * This page shows various locator strategies and interaction patterns
 */
export class ExamplePage extends BasePage {
  // Header elements
  private readonly pageHeader: Locator;
  private readonly pageSubtitle: Locator;
  
  // Form elements
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly countryDropdown: Locator;
  private readonly termsCheckbox: Locator;
  private readonly submitButton: Locator;
  
  // Search and filter
  private readonly searchInput: Locator;
  private readonly filterButton: Locator;
  private readonly sortDropdown: Locator;
  
  // Table elements
  private readonly dataTable: Locator;
  private readonly tableRows: Locator;
  private readonly tableHeaders: Locator;
  
  // Modal/Dialog elements
  private readonly modalDialog: Locator;
  private readonly modalTitle: Locator;
  private readonly modalCloseButton: Locator;
  private readonly modalConfirmButton: Locator;
  
  // Notification elements
  private readonly successNotification: Locator;
  private readonly errorNotification: Locator;
  private readonly notificationCloseButton: Locator;
  
  // Navigation elements
  private readonly breadcrumb: Locator;
  private readonly backButton: Locator;
  private readonly nextButton: Locator;

  constructor(page: Page) {
    super(page, 'ExamplePage');
    
    // Initialize all locators in constructor
    // Multiple selector strategies for robustness
    
    // Header
    this.pageHeader = page.locator('h1.page-title, [data-testid="page-title"]');
    this.pageSubtitle = page.locator('.page-subtitle, [data-testid="subtitle"]');
    
    // Form elements - using various selector strategies
    this.nameInput = page.locator('input[name="name"], #name-input, [data-testid="name"]');
    this.emailInput = page.locator('input[type="email"], input[name="email"], [placeholder="Email"]');
    this.phoneInput = page.locator('input[type="tel"], input[name="phone"]');
    this.countryDropdown = page.locator('select[name="country"], [data-testid="country-select"]');
    this.termsCheckbox = page.locator('input[type="checkbox"][name="terms"], #terms-checkbox');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
    
    // Search and filter
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    this.filterButton = page.locator('button:has-text("Filter"), [data-testid="filter-button"]');
    this.sortDropdown = page.locator('select[name="sort"], [data-testid="sort-select"]');
    
    // Table
    this.dataTable = page.locator('table, [role="table"], .data-table');
    this.tableRows = page.locator('table tbody tr, [role="row"]');
    this.tableHeaders = page.locator('table thead th, [role="columnheader"]');
    
    // Modal/Dialog
    this.modalDialog = page.locator('[role="dialog"], .modal, .dialog-container');
    this.modalTitle = page.locator('[role="dialog"] h2, .modal-title');
    this.modalCloseButton = page.locator('[role="dialog"] button[aria-label="Close"], .modal-close');
    this.modalConfirmButton = page.locator('[role="dialog"] button:has-text("Confirm"), .modal-confirm');
    
    // Notifications
    this.successNotification = page.locator('[role="alert"].success, .notification.success, .toast.success');
    this.errorNotification = page.locator('[role="alert"].error, .notification.error, .toast.error');
    this.notificationCloseButton = page.locator('[role="alert"] button, .notification-close');
    
    // Navigation
    this.breadcrumb = page.locator('nav[aria-label="breadcrumb"], .breadcrumb');
    this.backButton = page.locator('button:has-text("Back"), [data-testid="back-button"]');
    this.nextButton = page.locator('button:has-text("Next"), [data-testid="next-button"]');
  }

  // ============ Page Navigation ============
  
  async navigateToExamplePage(): Promise<void> {
    this.logger.step('Navigate to example page');
    await this.navigate('/example');
  }

  // ============ Form Interactions ============
  
  async fillForm(data: { name: string; email: string; phone?: string; country?: string }): Promise<void> {
    this.logger.step('Fill form with data');
    
    await this.fill(this.nameInput, data.name, 'Name Input');
    await this.fill(this.emailInput, data.email, 'Email Input');
    
    if (data.phone) {
      await this.fill(this.phoneInput, data.phone, 'Phone Input');
    }
    
    if (data.country) {
      await this.selectOption(this.countryDropdown, data.country, 'Country Dropdown');
    }
  }

  async acceptTerms(): Promise<void> {
    this.logger.action('Accept terms and conditions');
    await this.check(this.termsCheckbox, 'Terms Checkbox');
  }

  async submitForm(): Promise<void> {
    this.logger.action('Submit form');
    await this.click(this.submitButton, 'Submit Button');
  }

  // ============ Search & Filter ============
  
  async searchFor(query: string): Promise<void> {
    this.logger.action(`Search for: ${query}`);
    await this.fill(this.searchInput, query, 'Search Input');
    await this.pressKey('Enter');
  }

  async applyFilter(): Promise<void> {
    this.logger.action('Apply filters');
    await this.click(this.filterButton, 'Filter Button');
  }

  async sortBy(option: string): Promise<void> {
    this.logger.action(`Sort by: ${option}`);
    await this.selectOption(this.sortDropdown, { label: option }, 'Sort Dropdown');
  }

  // ============ Table Operations ============
  
  async getTableRowCount(): Promise<number> {
    this.logger.action('Get table row count');
    const count = await this.tableRows.count();
    this.logger.info(`Table has ${count} rows`);
    return count;
  }

  async getTableCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    this.logger.action(`Get cell value at row ${rowIndex}, column ${columnIndex}`);
    const cell = this.page.locator(`table tbody tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`);
    return await this.getText(cell);
  }

  async clickTableRowAction(rowIndex: number, actionName: string): Promise<void> {
    this.logger.action(`Click ${actionName} on row ${rowIndex}`);
    const actionButton = this.page.locator(`table tbody tr:nth-child(${rowIndex}) button:has-text("${actionName}")`);
    await this.click(actionButton, `${actionName} Button`);
  }

  async getTableHeaders(): Promise<string[]> {
    this.logger.action('Get table headers');
    const headers = await this.tableHeaders.allTextContents();
    this.logger.info(`Headers: ${headers.join(', ')}`);
    return headers;
  }

  // ============ Modal Operations ============
  
  async waitForModal(timeout: number = 5000): Promise<void> {
    this.logger.action('Wait for modal to appear');
    await this.waitForElement(this.modalDialog, timeout, 'Modal Dialog');
  }

  async getModalTitle(): Promise<string> {
    this.logger.action('Get modal title');
    return await this.getText(this.modalTitle, 'Modal Title');
  }

  async closeModal(): Promise<void> {
    this.logger.action('Close modal');
    await this.click(this.modalCloseButton, 'Modal Close Button');
    await this.waitForElementHidden(this.modalDialog, 5000, 'Modal Dialog');
  }

  async confirmModal(): Promise<void> {
    this.logger.action('Confirm modal');
    await this.click(this.modalConfirmButton, 'Modal Confirm Button');
  }

  // ============ Notification Operations ============
  
  async waitForSuccessNotification(): Promise<void> {
    this.logger.action('Wait for success notification');
    await this.waitForElement(this.successNotification, 5000, 'Success Notification');
  }

  async waitForErrorNotification(): Promise<void> {
    this.logger.action('Wait for error notification');
    await this.waitForElement(this.errorNotification, 5000, 'Error Notification');
  }

  async getNotificationMessage(): Promise<string> {
    this.logger.action('Get notification message');
    const notification = this.page.locator('[role="alert"], .notification, .toast').first();
    return await this.getText(notification, 'Notification');
  }

  async closeNotification(): Promise<void> {
    this.logger.action('Close notification');
    await this.click(this.notificationCloseButton, 'Notification Close Button');
  }

  // ============ Navigation Operations ============
  
  async getBreadcrumbText(): Promise<string> {
    this.logger.action('Get breadcrumb text');
    return await this.getText(this.breadcrumb, 'Breadcrumb');
  }

  async clickBack(): Promise<void> {
    this.logger.action('Click back button');
    await this.click(this.backButton, 'Back Button');
  }

  async clickNext(): Promise<void> {
    this.logger.action('Click next button');
    await this.click(this.nextButton, 'Next Button');
  }

  // ============ Verification Methods ============
  
  async verifyPageLoaded(): Promise<boolean> {
    this.logger.action('Verify page is loaded');
    try {
      await this.waitForElement(this.pageHeader, 10000, 'Page Header');
      return true;
    } catch {
      return false;
    }
  }

  async getPageTitle(): Promise<string> {
    this.logger.action('Get page title');
    return await this.getText(this.pageHeader, 'Page Header');
  }

  async isFormValid(): Promise<boolean> {
    this.logger.action('Check if form is valid');
    const isEnabled = await this.submitButton.isEnabled();
    this.logger.info(`Form valid: ${isEnabled}`);
    return isEnabled;
  }

  // ============ Dynamic Element Interactions ============
  
  /**
   * Click element by text content (dynamic)
   */
  async clickElementByText(text: string): Promise<void> {
    this.logger.action(`Click element with text: ${text}`);
    const element = this.page.locator(`button:has-text("${text}"), a:has-text("${text}"), [role="button"]:has-text("${text}")`);
    await this.click(element, text);
  }

  /**
   * Get all items in a list
   */
  async getListItems(listSelector: string = 'ul li, ol li'): Promise<string[]> {
    this.logger.action('Get list items');
    const items = this.page.locator(listSelector);
    const texts = await items.allTextContents();
    this.logger.info(`Found ${texts.length} list items`);
    return texts;
  }

  /**
   * Select item from list by index
   */
  async selectListItem(index: number, listSelector: string = 'ul li, ol li'): Promise<void> {
    this.logger.action(`Select list item at index ${index}`);
    const item = this.page.locator(listSelector).nth(index);
    await this.click(item, `List Item ${index}`);
  }
}
