import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { ModelPage } from '../pages/model.page';
import { SidebarComponent } from '../components/sidebar.components';

let modelPage: ModelPage;
let sidebarComponent: SidebarComponent;

// Navigation steps
When('the user clicks on the Model navigation button', async function(this: CustomWorld) {
  modelPage = new ModelPage(this.page);
  sidebarComponent = new SidebarComponent(this.page);
  await sidebarComponent.clickMenuItem('Model');
  await this.page.waitForLoadState('networkidle');
  await sidebarComponent.waitForMenuItemActive('Model');
});

// Tab verification
Then('the {string} tab should be displayed', async function(this: CustomWorld, tabName: string) {
  const tab = modelPage.getTab(tabName);
  await expect(tab).toBeVisible();
});

// Metric verification
Then('the {string} metric should be displayed', async function(this: CustomWorld, metricName: string) {
  const metric = modelPage.getMetric(metricName);
  await expect(metric).toBeVisible();
});

Then('the total stainers count should be displayed', async function(this: CustomWorld) {
  const count = await modelPage.getTotalStainersCount();
  this.logger.info(`Total Stainers Count: ${count}`);
  expect(+count).toBeGreaterThanOrEqual(0);
});

Then('the following stains should be displayed:', async function(this: CustomWorld, dataTable) {
  const rows = dataTable.hashes();
  
  for (const row of rows) {
    const stainName = row['Stain Name'];
    const stainType = row['Stain Type'];
    const version = row['Version'];
    
    // Verify stain name is visible
    const stainElement = modelPage.getStainElement(stainName);
    await expect(stainElement.first()).toBeVisible();
    
    // Verify stain type is visible
    const typeElement = modelPage.getStainTypeElement(stainType);
    await expect(typeElement.first()).toBeVisible();
    
    // Verify version is visible
    const versionElement = modelPage.getVersionElement(version);
    await expect(versionElement.first()).toBeVisible();
  }
});

// Checkbox verification
Then('each stain should have an associated toggle switch', async function(this: CustomWorld) {
  const checkboxes = modelPage.getCheckboxes();
  const count = await checkboxes.count();
  expect(count).toBeGreaterThan(0);
});

Then('the {string} toggle switch should be checked', async function(this: CustomWorld, stainInfo: string) {
  // Extract stain name and version from string like "H&E v0.1.0"
  const [stainName, version] = stainInfo.split(' ');
  
  const checkbox = modelPage.getStainCheckbox(stainName, version);
  await expect(checkbox).toBeChecked();
});
