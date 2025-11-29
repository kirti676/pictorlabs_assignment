# Playwright + TypeScript + Cucumber Automation Framework

A comprehensive test automation framework using Playwright, TypeScript, and Cucumber BDD with Page Object Model design pattern.

## 🚀 Features

- ✅ **Playwright** - Fast, reliable end-to-end testing
- ✅ **TypeScript** - Type-safe code with IntelliSense support
- ✅ **Cucumber BDD** - Behavior-driven development with Gherkin syntax
- ✅ **Page Object Model** - Maintainable and scalable page objects with constructor-initialized locators
- ✅ **Reusable Components** - Common UI component abstractions
- ✅ **Data-Driven Testing** - Test data injection from JSON files
- ✅ **Authentication State** - Session management and auth state persistence
- ✅ **Environment Configuration** - Multi-environment support with .env files
- ✅ **Logging** - Comprehensive Winston-based logging
- ✅ **Allure Reporting** - Beautiful test reports with screenshots
- ✅ **Parallel Execution** - Run tests in parallel for faster execution
- ✅ **Cross-Browser Testing** - Support for Chromium, Firefox, and WebKit

## 📁 Project Structure

```
playwright-cucumber-typescript-framework/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── header.components.ts
│   │   └── sidebar.components.ts
│   ├── config/              # Configuration files
│   │   └── environment.ts
│   ├── data/                # Test data JSON files
│   │   └── testData.json
│   ├── features/            # Cucumber feature files
│   │   ├── login.feature
│   │   └── dashboard.feature
│   ├── fixtures/            # Test fixtures and browser management
│   │   └── browser.fixture.ts
│   ├── pages/               # Page Object Model classes
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   ├── step-definitions/    # Cucumber step definitions
│   │   ├── login.steps.ts
│   │   └── dashboard.steps.ts
│   ├── support/             # Cucumber support files
│   │   ├── hooks.ts
│   │   └── world.ts
│   └── utils/               # Utility functions
│       ├── auth.helper.ts
│       ├── data.helper.ts
│       └── logger.ts
├── reports/                 # Test reports and artifacts
├── logs/                    # Log files
├── .auth/                   # Saved authentication states
├── .env                     # Environment variables
├── .env.example            # Example environment variables
├── cucumber.js             # Cucumber configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project folder)
   ```bash
   cd d:\PictorLabs_Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```
   
   Or use the setup script:
   ```bash
   npm run setup
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update values if needed:
   ```bash
   copy .env.example .env
   ```

   The default configuration is already set for the application:
   - **URL**: https://development.prism.deepstain.com/
   - **Username**: pictor.newqa.guest@pictorlabs.ai
   - **Password**: MUT!RHrc6a!@4Fp

## 🏃 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in parallel
```bash
npm run test:parallel
```

### Run tests in specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### Run tests in all browsers
```bash
npm run test:all-browsers
```

### Run specific feature
```bash
npx cucumber-js src/features/login.feature
```

### Run tests with specific tags
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@regression"
npx cucumber-js --tags "@positive"
```

## 📊 Reports

### Generate Allure Report
```bash
npm run report
```

This will:
1. Generate the Allure report from test results
2. Open the report in your default browser

### Manual Allure Commands
```bash
# Generate report
npm run allure:generate

# Open existing report
npm run allure:open
```

### Report Locations
- **Allure Results**: `./reports/allure-results/`
- **Allure Report**: `./reports/allure-report/`
- **Cucumber HTML**: `./reports/cucumber-report.html`
- **Cucumber JSON**: `./reports/cucumber-report.json`
- **Screenshots**: `./reports/screenshots/`
- **Videos**: `./reports/videos/`
- **Logs**: `./logs/`

## 🔧 Configuration

### Environment Variables (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `ENV` | Environment name | `dev` |
| `BASE_URL` | Application URL | `https://development.prism.deepstain.com/` |
| `USERNAME` | Login username | `pictor.newqa.guest@pictorlabs.ai` |
| `PASSWORD` | Login password | `MUT!RHrc6a!@4Fp` |
| `BROWSER` | Browser to use | `chromium` |
| `HEADLESS` | Run in headless mode | `false` |
| `TIMEOUT` | Default timeout (ms) | `30000` |
| `PARALLEL_WORKERS` | Number of parallel workers | `3` |
| `SCREENSHOT_ON_FAILURE` | Take screenshot on failure | `true` |

### Cucumber Profiles

Defined in `cucumber.js`:
- **default** - Standard execution
- **chrome** - Run in Chromium
- **firefox** - Run in Firefox
- **safari** - Run in WebKit (Safari)
- **parallel** - Run with 3 parallel workers

## 📝 Writing Tests

### 1. Create Feature File

Create a new `.feature` file in `src/features/`:

```gherkin
@smoke @regression
Feature: My Feature
  As a user
  I want to perform an action
  So that I can achieve a goal

  Scenario: My Test Scenario
    Given I am on the home page
    When I click the button
    Then I should see the result
```

### 2. Create Page Object

Create a new page class in `src/pages/`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MyPage extends BasePage {
  // Declare locators
  private readonly myButton: Locator;
  private readonly myElement: Locator;

  constructor(page: Page) {
    super(page, 'MyPage');
    
    // Initialize locators in constructor
    this.myButton = page.locator('#my-button');
    this.myElement = page.locator('.my-element');
  }

  async clickMyButton(): Promise<void> {
    await this.click(this.myButton, 'My Button');
  }
}
```

### 3. Create Step Definitions

Create step definitions in `src/step-definitions/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { MyPage } from '../pages/my.page';

let myPage: MyPage;

Given('I am on the home page', async function (this: CustomWorld) {
  myPage = new MyPage(this.page);
  await myPage.navigate('/');
});

When('I click the button', async function (this: CustomWorld) {
  await myPage.clickMyButton();
});

Then('I should see the result', async function (this: CustomWorld) {
  // Add assertions
  expect(await myPage.isVisible()).toBeTruthy();
});
```

### 4. Add Test Data

Add test data to `src/data/testData.json`:

```json
{
  "myFeature": {
    "testValue": "example",
    "expectedResult": "success"
  }
}
```

## 🧩 Reusable Components

The framework includes reusable components for common UI interactions:

- **HeaderComponent** - MUI AppBar header interactions (back button, support icon, profile menu)
- **SidebarComponent** - MUI Drawer sidebar navigation (menu items, toggle, active state)

Example usage:

```typescript
import { HeaderComponent } from '../components/header.components';
import { SidebarComponent } from '../components/sidebar.components';

// Header component
const header = new HeaderComponent(page);
await header.waitForHeader();
await header.clickUserProfileMenu();

// Sidebar component
const sidebar = new SidebarComponent(page);
await sidebar.waitForSidebar();
await sidebar.clickDashboard();
await sidebar.isMenuItemActive('Dashboard'); // returns true/false
```

## 🔐 Authentication State

The framework automatically manages authentication:

1. On first run, it logs in and saves the session to `.auth/user.json`
2. Subsequent tests reuse the saved authentication state
3. Use `@noauth` or `@login` tags for scenarios that don't need/test authentication

## 📋 Tags

Organize tests using tags:

- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@positive` - Happy path scenarios
- `@negative` - Error/validation scenarios
- `@login` - Login-specific tests (no auth state)
- `@noauth` - Tests without authentication

## 🐛 Debugging

### Run in headed mode
Set `HEADLESS=false` in `.env` or:
```bash
HEADLESS=false npm test
```

### View logs
Check `./logs/test-execution.log` for detailed execution logs

### Screenshots on failure
Screenshots are automatically captured on test failures in `./reports/screenshots/`

## 📈 Best Practices

1. **Initialize locators in constructor** - All page locators are defined and initialized in the page class constructor
2. **Use BasePage methods** - Leverage common methods from BasePage for consistency
3. **Data-driven tests** - Store test data in JSON files
4. **Reusable components** - Use component classes for repeated UI patterns
5. **Meaningful logging** - Log important actions and assertions
6. **Tag appropriately** - Use tags to organize and filter tests
7. **Keep features focused** - One feature per file, focused scenarios

## 🤝 Contributing

1. Write clear, descriptive test scenarios
2. Follow the Page Object Model pattern
3. Add appropriate logging
4. Update test data files as needed
5. Run tests before committing

## 📄 License

ISC

## 🙋 Support

For questions or issues, please check the logs in `./logs/` or review the Allure report for detailed test execution information.

---

**Happy Testing! 🎉**
