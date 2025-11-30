import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { ModelPage } from '../pages/model.page';
import { SidebarComponent } from '../components/sidebar.components';

// Step definitions for model page and stainer management
let modelPage: ModelPage;
let sidebarComponent: SidebarComponent;

When('the user clicks on the Model navigation button', async function(this: CustomWorld) {
  modelPage = new ModelPage(this.page);
  sidebarComponent = new SidebarComponent(this.page);
  await sidebarComponent.clickMenuItem('Model');
  await this.page.waitForLoadState('networkidle');
  await sidebarComponent.waitForMenuItemActive('Model');
});

Then('the {string} tab should be displayed', async function(this: CustomWorld, tabName: string) {
  const tab = modelPage.getTab(tabName);
  await expect(tab).toBeVisible();
});

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
    
    const stainElement = modelPage.getStainElement(stainName);
    await expect(stainElement.first()).toBeVisible();
    
    const typeElement = modelPage.getStainTypeElement(stainType);
    await expect(typeElement.first()).toBeVisible();
    
    const versionElement = modelPage.getVersionElement(version);
    await expect(versionElement.first()).toBeVisible();
  }
});

Then('each stain should have an associated toggle switch', async function(this: CustomWorld) {
  const checkboxes = modelPage.getCheckboxes();
  const count = await checkboxes.count();
  expect(count).toBeGreaterThan(0);
});

Then('the {string} toggle switch should be checked', async function(this: CustomWorld, stainInfo: string) {
  const [stainName, version] = stainInfo.split(' ');
  
  const checkbox = modelPage.getStainCheckbox(stainName, version);
  await expect(checkbox).toBeChecked();
});
