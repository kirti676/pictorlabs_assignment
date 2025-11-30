import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class UploadsPage extends BasePage {
  // Static locators initialized in constructor
  private readonly uploadTab: Locator;
  private readonly inProgressTab: Locator;
  private readonly completedTab: Locator;
  private readonly uploadGuidelinesHeading: Locator;
  private readonly dragDropArea: Locator;
  private readonly instructions: Locator;
  private readonly selectedTab: Locator;

  constructor(page: Page) {
    super(page);
    this.uploadTab = page.getByRole('tab', { name: 'Upload' });
    this.inProgressTab = page.getByRole('tab', { name: 'In Progress' });
    this.completedTab = page.getByRole('tab', { name: 'Completed' });
    this.uploadGuidelinesHeading = page.getByRole('heading', { name: 'Upload Guidelines:', level: 3 });
    this.dragDropArea = page.locator('text=Choose files or drag and drop files here');
    this.instructions = page.locator('text=Select and upload slide files');
    this.selectedTab = page.getByRole('tab', { selected: true });
  }

  /**
   * Click In Progress tab
   */
  async clickInProgressTab(): Promise<void> {
    await this.inProgressTab.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click Completed tab
   */
  async clickCompletedTab(): Promise<void> {
    await this.completedTab.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click Upload tab
   */
  async clickUploadTab(): Promise<void> {
    await this.uploadTab.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verify upload guidelines displayed
   */
  async verifyUploadGuidelinesDisplayed(): Promise<void> {
    await expect(this.uploadGuidelinesHeading).toBeVisible();
  }

  /**
   * Verify guideline
   */
  async verifyGuideline(guideline: string): Promise<void> {
    const guidelineElement = this.page.locator(`text=${guideline}`);
    await expect(guidelineElement).toBeVisible();
  }

  /**
   * Verify drag drop area displayed
   */
  async verifyDragDropAreaDisplayed(): Promise<void> {
    await expect(this.dragDropArea).toBeVisible();
  }

  /**
   * Verify supported formats
   */
  async verifySupportedFormats(formats: string): Promise<void> {
    const formatsElement = this.page.locator(`text=${formats}`);
    await expect(formatsElement).toBeVisible();
  }

  /**
   * Verify max file size
   */
  async verifyMaxFileSize(maxSize: string): Promise<void> {
    const sizeElement = this.page.locator(`text=${maxSize}`);
    await expect(sizeElement).toBeVisible();
  }

  /**
   * Get instructions element
   */
  getInstructions(): Locator {
    return this.instructions;
  }

  /**
   * Get text element
   */
  getTextElement(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  /**
   * Get icon in drag drop area
   */
  getDragDropIcon(): Locator {
    return this.dragDropArea.locator('..').getByTestId('CloudUploadIcon');
  }

  /**
   * Get button element
   */
  getUploadButton(buttonName: string): Locator {
    return this.dragDropArea.locator('../..').getByRole('button', { name: buttonName });
  }

  /**
   * Get description element
   */
  getDescriptionElement(description: string): Locator {
    return this.page.locator(`text=${description}`);
  }

  /**
   * Get selected tab
   */
  getSelectedTab(): Locator {
    return this.selectedTab;
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
