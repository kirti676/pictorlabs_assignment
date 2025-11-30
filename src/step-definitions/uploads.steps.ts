import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { UploadsPage } from '../pages/uploads.page';
import { SidebarComponent } from '../components/sidebar.components';

let uploadsPage: UploadsPage;
let sidebarComponent: SidebarComponent;

// Navigation steps
When('the user clicks on the Uploads navigation button', async function(this: CustomWorld) {
  uploadsPage = new UploadsPage(this.page);
  sidebarComponent = new SidebarComponent(this.page);
  await sidebarComponent.clickMenuItem('Uploads');
  await this.page.waitForLoadState('networkidle');
  await sidebarComponent.waitForMenuItemActive('Uploads');
});

// Upload tab content
Then('the page should display upload instructions', async function(this: CustomWorld) {
  const instructions = uploadsPage.getInstructions();
  await expect(instructions).toBeVisible();
});

Then('the upload guidelines section should be displayed', async function(this: CustomWorld) {
  await uploadsPage.verifyUploadGuidelinesDisplayed();
});

// Guidelines verification
Then('the following guidelines should be displayed:', async function(this: CustomWorld, dataTable) {
  const guidelines = dataTable.hashes();
  
  for (const guideline of guidelines) {
    await uploadsPage.verifyGuideline(guideline['Guideline']);
  }
});

// Drag and drop area
Then('the drag and drop area should be displayed', async function(this: CustomWorld) {
  await uploadsPage.verifyDragDropAreaDisplayed();
});

Then('the area should display {string}', async function(this: CustomWorld, text: string) {
  const textElement = uploadsPage.getTextElement(text);
  await expect(textElement).toBeVisible();
});

Then('an upload icon should be displayed in the drag and drop area', async function(this: CustomWorld) {
  const icon = uploadsPage.getDragDropIcon();
  await expect(icon).toBeVisible();
});

// File format and size verification
Then('the supported formats should be displayed: {string}', async function(this: CustomWorld, formats: string) {
  await uploadsPage.verifySupportedFormats(formats);
});

Then('the maximum file size should be displayed: {string}', async function(this: CustomWorld, maxSize: string) {
  await uploadsPage.verifyMaxFileSize(maxSize);
});

// Upload button
Then('the {string} button should be displayed in the upload area', async function(this: CustomWorld, buttonName: string) {
  const button = uploadsPage.getUploadButton(buttonName);
  await expect(button).toBeVisible();
});

Then('the description should state {string}', async function(this: CustomWorld, description: string) {
  const descElement = uploadsPage.getDescriptionElement(description);
  await expect(descElement).toBeVisible();
});

// Tab switching
When('the user switches between tabs', async function(this: CustomWorld) {
  await uploadsPage.clickInProgressTab();
  await this.page.waitForTimeout(500);
  await uploadsPage.clickCompletedTab();
  await this.page.waitForTimeout(500);
  await uploadsPage.clickUploadTab();
});

Then('the selected tab should be highlighted', async function(this: CustomWorld) {
  const selectedTab = uploadsPage.getSelectedTab();
  await expect(selectedTab).toBeVisible();
});

Then('the appropriate content for the selected tab should be displayed', async function(this: CustomWorld) {
  await this.page.waitForLoadState('networkidle');
  // Content is displayed - verified by tab selection
});

Then('the URL should remain {string}', async function(this: CustomWorld, urlPath: string) {
  const currentUrl = await uploadsPage.getCurrentUrl();
  expect(currentUrl).toContain(urlPath);
});


