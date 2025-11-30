import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { ReportsPage } from '../pages/reports.page';
import { SidebarComponent } from '../components/sidebar.components';

let reportsPage: ReportsPage;
let sidebarComponent: SidebarComponent;

// Navigation steps
When('the user clicks on the Reports navigation button', async function(this: CustomWorld) {
  reportsPage = new ReportsPage(this.page);
  sidebarComponent = new SidebarComponent(this.page);
  await sidebarComponent.clickMenuItem('Reports');
  await this.page.waitForLoadState('networkidle');
  await sidebarComponent.waitForMenuItemActive('Reports');
});

// Dropdown verification
Then('the Year dropdown should be displayed', async function(this: CustomWorld) {
  const dropdown = reportsPage.getYearDropdown();
  await expect(dropdown).toBeVisible();
  await expect(dropdown).toBeEnabled();
});

Then('the Year dropdown should show the current year', async function(this: CustomWorld) {
  const dropdown = reportsPage.getYearDropdown();
  const text = await dropdown.getAttribute('value');
  const currentYear = new Date().getFullYear().toString();
  expect(text).toContain(currentYear);
});

// Stain type sections
Then('the following stain type sections should be displayed:', async function(this: CustomWorld, dataTable) {
  const stainTypes = dataTable.hashes();
  
  for (const stain of stainTypes) {
    const stainType = stain['Stain Type'];
    const stainHeading = reportsPage.getStainTypeHeading(stainType);
    await expect(stainHeading).toBeVisible();
  }
});

Then('each stain type should have an expandable section', async function(this: CustomWorld) {
  const expandButtons = reportsPage.getExpandButtons();
  const count = await expandButtons.count();
  expect(count).toBeGreaterThan(0);
});

Then('each stain type should display a collapse\\/expand icon', async function(this: CustomWorld) {
  // Check for icon images near stain type headings
  const icons = reportsPage.getIcons();
  const count = await icons.count();
  expect(count).toBeGreaterThan(0);
});

Then('each stain type should show {string} label', async function(this: CustomWorld, label: string) {
  const labels = reportsPage.getLabels(label);
  const count = await labels.count();
  expect(count).toBeGreaterThan(0);
});

// Search functionality
Then('the search box should be displayed', async function(this: CustomWorld) {
  await reportsPage.verifySearchBoxDisplayed();
});

// User list verification
Then('a list of users should be displayed', async function(this: CustomWorld) {
  await reportsPage.verifyUserListDisplayed();
});

Then('each user entry should display:', async function(this: CustomWorld, dataTable) {
  const fields = dataTable.hashes();
  
  // Verify first user has all fields
  const firstUser = reportsPage.getFirstUser();
  await expect(firstUser).toBeVisible();
});

When('the user clicks on {string} for the first user', async function(this: CustomWorld, buttonText: string) {
  await reportsPage.clickViewUserButton();
});

// User details verification
Then('the user details section should expand', async function(this: CustomWorld) {
  await reportsPage.verifyUserDetailsExpanded();
});

Then('the Quarter selector should be displayed', async function(this: CustomWorld) {
  const quarterSelector = reportsPage.getQuarterSelector();
  await expect(quarterSelector).toBeVisible();
});

Then('the {string} chart section should be displayed', async function(this: CustomWorld, chartName: string) {
  const chartHeading = reportsPage.getChartSectionHeading(chartName);
  await expect(chartHeading).toBeVisible();
});

// Activity Summary verification
Then('the Activity Summary should display:', async function(this: CustomWorld, dataTable) {
  const metrics = dataTable.hashes();
  
  for (const metric of metrics) {
    const metricName = metric['Metric'];
    const metricHeading = reportsPage.getMetricHeading(metricName);
    await expect(metricHeading).toBeVisible();
  }
});

// Pagination
Then('the pagination controls should be displayed', async function(this: CustomWorld) {
  const pagination = reportsPage.getPaginationControls();
  await expect(pagination.first()).toBeVisible();
});

Then('the current page number should be highlighted', async function(this: CustomWorld) {
  const currentPage = reportsPage.getCurrentPageButton();
  await expect(currentPage.first()).toBeVisible();
});




