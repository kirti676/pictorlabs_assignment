import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DashboardPage } from '../pages/dashboard.page';
import { SidebarComponent } from '../components/sidebar.components';
import { environment } from '../config/environment';

// Step definitions for dashboard page verification
let sidebarComponent: SidebarComponent;
let dashboardPage: DashboardPage;

// Calculate current quarter text in format: "Q1 January - March 2025"
function getCurrentQuarterText(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  
  let quarter: number;
  let monthRange: string;
  
  if (month >= 0 && month <= 2) {
    quarter = 1;
    monthRange = 'January - March';
  } else if (month >= 3 && month <= 5) {
    quarter = 2;
    monthRange = 'April - June';
  } else if (month >= 6 && month <= 8) {
    quarter = 3;
    monthRange = 'July - September';
  } else {
    quarter = 4;
    monthRange = 'October - December';
  }
  
  return `Q${quarter} ${monthRange} ${year}`;
}

const quarterText = getCurrentQuarterText();

Given('the user is on the Dashboard page', async function(this: CustomWorld) {
  sidebarComponent = new SidebarComponent(this.page);
  dashboardPage = new DashboardPage(this.page);
  await sidebarComponent.clickDashboard();
  await sidebarComponent.waitForMenuItemActive('Dashboard');
  expect(await sidebarComponent.isMenuItemActive('Dashboard')).toBe(true);
});

Then('the URL should be baseUrl', async function(this: CustomWorld) {
  const currentUrl = this.page.url();
  const baseUrl = environment.get('baseUrl');
  expect(currentUrl).toBe(baseUrl);
});

Then('the page title should be {string}', async function(this: CustomWorld, title: string) {
  const pageTitle = await this.page.title();
  expect(pageTitle).toBe(title);
});

Then('the {string} card should be displayed', async function(this: CustomWorld, cardName: string) {
  const card = dashboardPage.getCard(cardName);
  await expect(card).toBeVisible();
});

Then('the card should have a {string}', async function(this: CustomWorld, iconType: string) {
  const icon = dashboardPage.getIcon(iconType);
  await expect(icon).toBeVisible();
});

Then('the following metrics should be displayed:', async function(this: CustomWorld, dataTable) {
  const metrics = dataTable.hashes();
  
  for (const metric of metrics) {
    const metricName = metric['Metric'];
    const metricElement = dashboardPage.getMetric(metricName);
    await expect(metricElement).toBeVisible();
  }
});

Then('each Slide Overview metric should display a count value', async function(this: CustomWorld) {
  const counts = dashboardPage.getMetricCounts();
  const count = await counts.count();
  expect(count).toBeGreaterThan(0);
});

Then('the quality metric should show Pass Fail labels', async function(this: CustomWorld) {
  const passLabel = dashboardPage.getQualityLabel('Pass');
  const failLabel = dashboardPage.getQualityLabel('Fail');
  await expect(passLabel).toBeVisible();
  await expect(failLabel).toBeVisible();
});

Then('a quality progress bar should be displayed', async function(this: CustomWorld) {
  const progressBar = dashboardPage.getProgressBar();
  await expect(progressBar.first()).toBeVisible();
});

Then('the following stain type cards should be displayed:', async function(this: CustomWorld, dataTable) {
  const stainTypes = dataTable.hashes();
  
  for (const stain of stainTypes) {
    const stainType = stain['Stain Type'];
    const stainElement = dashboardPage.getStainType(stainType);
    await expect(stainElement.first()).toBeVisible();
  }
});

Then('each stain card should have an icon', async function(this: CustomWorld) {
  const icons = dashboardPage.getIcons();
  const count = await icons.count();
  expect(count).toBeGreaterThan(0);
});

Then('each stain card should display stain counts for:', async function(this: CustomWorld, dataTable) {
  const statuses = dataTable.hashes();
  
  for (const status of statuses) {
    const statusName = status['Status'];
    const statusElement = dashboardPage.getStatus(statusName);
    await expect(statusElement.first()).toBeVisible();
  }
});

Then('a quarter selector dropdown should be displayed', async function(this: CustomWorld) {
  const dropdown = dashboardPage.getQuarterDropdown();
  await expect(dropdown).toBeVisible();
  const text = await dropdown.getAttribute('value');
  expect(text).toContain(quarterText);
});

Then('a chart area should be displayed', async function(this: CustomWorld) {
  const chartArea = dashboardPage.getChartArea();
  await expect(chartArea.first()).toBeVisible();
});

Then('the description {string} should be displayed', async function(this: CustomWorld, description: string) {
  const descElement = dashboardPage.getDescription(description);
  await expect(descElement).toBeVisible();
});

Then('a search box should be displayed with placeholder {string}', async function(this: CustomWorld, placeholder: string) {
  const searchBox = dashboardPage.getSearchBox(placeholder);
  await expect(searchBox).toBeVisible();
});

Then('an {string} button should be displayed', async function(this: CustomWorld, buttonName: string) {
  const button = dashboardPage.getButton(buttonName);
  await expect(button.first()).toBeVisible();
});

Then('the following action buttons should be displayed:', async function(this: CustomWorld, dataTable) {
  const buttons = dataTable.hashes();
  
  for (const button of buttons) {
    const buttonName = button['Button Name'];
    const buttonElement = dashboardPage.getButton(buttonName);
    await expect(buttonElement).toBeVisible();
  }
});

Then('the slides table should display the following columns:', async function(this: CustomWorld, dataTable) {
  const columns = dataTable.hashes();
  
  for (const column of columns) {
    const columnName = column['Column Name'];
    if (columnName !== 'Checkbox') {
      const columnElement = dashboardPage.getTableColumn(columnName);
      await expect(columnElement.first()).toBeVisible();
    }
  }
});

Then('the following columns should have sort icons:', async function(this: CustomWorld, dataTable) {
  const columns = dataTable.hashes();
  
  for (const column of columns) {
    const columnName = column['Column Name'];
    const columnButton = dashboardPage.getSortableColumn(columnName);
    await expect(columnButton).toBeVisible();
  }
});

When('the user clicks on {string} button', async function(this: CustomWorld, elementName: string) {
  const element = dashboardPage.getButton(elementName);
  await element.click();
  await this.page.waitForLoadState('networkidle');
});

Then('a filter menu should be displayed', async function(this: CustomWorld) {
  const menu = dashboardPage.getFilterMenu();
  await expect(menu).toBeVisible();
});

Then('the following filter options should be available:', async function(this: CustomWorld, dataTable) {
  const filters = dataTable.hashes();
  
  for (const filter of filters) {
    const filterOption = filter['Filter Option'];
    const filterElement = dashboardPage.getFilterOption(filterOption);
    await expect(filterElement).toBeVisible();
  }

  await this.page.click('body');
});

Then('the projects table should display the following columns:', async function(this: CustomWorld, dataTable) {
  const columns = dataTable.hashes();
  
  for (const column of columns) {
    const columnName = column['Column Name'];
    const columnElement = dashboardPage.getTableColumn(columnName);
    await expect(columnElement).toBeVisible();
  }
});
