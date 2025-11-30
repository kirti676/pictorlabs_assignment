# Playwright + Cucumber + TypeScript Automation Framework

A robust, scalable automation testing framework built with Playwright, Cucumber BDD, and TypeScript for end-to-end testing.

## Table of Contents
- [Technology Stack](#technology-stack)
- [Framework Best Practices](#framework-best-practices)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Execution Instructions](#execution-instructions)
- [Viewing Reports](#viewing-reports)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Configuration](#environment-configuration)

---

## Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **TypeScript** | 5.3.3 | Type-safe programming language |
| **Playwright** | 1.40.1 | Browser automation framework |
| **Cucumber** | 10.9.0 | BDD test framework |
| **Node.js** | 18+ | JavaScript runtime |

### Testing & Reporting
- **@cucumber/cucumber**: BDD test execution
- **multiple-cucumber-html-reporter**: HTML report generation
- **Winston**: Logging framework
- **ts-node**: TypeScript execution for Node.js

### Development Tools
- **dotenv**: Environment variable management
- **rimraf**: Cross-platform file/directory removal

---

## Framework Best Practices

### 1. **Page Object Model (POM)**
- Separation of page elements and actions from test logic
- Reusable page classes with encapsulated methods
- Base page class for common functionality

### 2. **Component-Based Architecture**
- Separate components for reusable UI elements (Header, Sidebar)
- Modular design for better maintainability

### 3. **BDD with Cucumber**
- Human-readable feature files using Gherkin syntax
- Scenario-driven testing approach
- Tag-based test organization (@smoke, @regression, @ui, @api)

### 4. **Separation of Concerns**
```
├── pages/         # Page Objects
├── components/    # Reusable UI components
├── step-definitions/  # Step implementations
├── features/      # Gherkin feature files
├── utils/         # Helper utilities
├── fixtures/      # Browser & test fixtures
├── config/        # Environment configuration
└── support/       # Hooks & World setup
```

### 5. **DRY (Don't Repeat Yourself)**
- Centralized configuration management
- Reusable utility functions
- Common helper methods for authentication and data handling

### 6. **Type Safety**
- Full TypeScript implementation
- Strict type checking enabled
- Interface definitions for configuration

### 7. **Logging & Debugging**
- Winston-based logging system
- Contextual logging with log levels
- Screenshot and video capture on failures

### 8. **Data-Driven Testing**
- External test data management (`testData.json`)
- Data helper utilities for test data loading
- Environment-based configuration

### 9. **Cross-Browser Testing**
- Support for Chrome, Firefox, and Edge
- Browser configuration through profiles
- Parallel execution capabilities

### 10. **CI/CD Integration**
- GitHub Actions workflow
- Automated test execution on commits
- Artifact management for reports

---

## Features

### Core Features
- **Multi-Browser Support**: Chrome, Firefox, Edge
- **Parallel Execution**: Run tests in parallel for faster feedback
- **BDD Framework**: Cucumber with Gherkin syntax
- **TypeScript**: Type-safe test automation
- **Page Object Model**: Maintainable and scalable architecture
- **Component-Based Design**: Reusable UI components
- **Environment Configuration**: Flexible env-based settings
- **Smart Logging**: Winston-based logging system

### Test Organization
- **Feature-Based Structure**: Login, Dashboard, Model, Uploads, Reports
- **Tag-Based Execution**: @smoke, @regression, @positive, @negative, @ui, @api
- **Test Data Management**: Centralized test data with helper utilities

### Reporting & Debugging
- **HTML Reports**: Beautiful Cucumber HTML reports
- **Screenshot on Failure**: Auto-capture on test failures
- **Video Recording**: Optional video capture
- **Detailed Logging**: Winston logger with multiple levels

### Test Optimization
- **Smart Login**: One-time login per feature to reduce execution time
- **Retry Mechanism**: Configurable retry for flaky tests
- **Selective Execution**: Run specific scenarios by tags
- **Parallel Execution**: Run multiple scenarios concurrently

### CI/CD Features
- **Automated Pipeline**: GitHub Actions integration
- **Multi-Browser CI**: Tests run on all browsers
- **Artifact Management**: Reports stored for 30 days
- **Build Status**: Automatic notifications on failures

---

## Prerequisites

Before running the tests, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Git** (for version control)
   ```bash
   git --version
   ```

---

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PictorLabs_Assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

### 4. Environment Setup
Create a `.env` file in the root directory (optional - defaults are provided):
```env
# Environment
ENV=dev
BASE_URL=https://development.prism.deepstain.com/

# Credentials
TEST_USERNAME=your-username
TEST_PASSWORD=your-password

# Browser Configuration
BROWSER=chromium
HEADLESS=false
SLOW_MO=0

# Test Configuration
TIMEOUT=30000
PARALLEL_WORKERS=3
RETRY_COUNT=1

# Debugging
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=false
```

---

## Project Structure

```
PictorLabs_Assignment/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # CI/CD pipeline configuration
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── header.components.ts
│   │   └── sidebar.components.ts
│   ├── config/
│   │   └── environment.ts         # Environment configuration
│   ├── data/
│   │   └── testData.json          # Test data
│   ├── features/                  # Gherkin feature files
│   │   ├── login.feature
│   │   ├── dashboard.feature
│   │   ├── model.feature
│   │   ├── uploads.feature
│   │   └── reports.feature
│   ├── fixtures/
│   │   └── browser.fixture.ts     # Browser setup and management
│   ├── pages/                     # Page Object Models
│   │   ├── base.page.ts
│   │   ├── common.page.ts
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   ├── model.page.ts
│   │   ├── uploads.page.ts
│   │   └── reports.page.ts
│   ├── step-definitions/          # Cucumber step implementations
│   │   ├── common.steps.ts
│   │   ├── login.steps.ts
│   │   ├── dashboard.steps.ts
│   │   ├── model.steps.ts
│   │   ├── uploads.steps.ts
│   │   └── reports.steps.ts
│   ├── support/                   # Test support files
│   │   ├── hooks.ts               # Before/After hooks
│   │   └── world.ts               # Custom World
│   └── utils/                     # Helper utilities
│       ├── auth.helper.ts
│       ├── data.helper.ts
│       └── logger.ts
├── reports/                       # Test reports (generated)
├── test-results/                  # Test artifacts (generated)
├── cucumber.js                    # Cucumber configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies
└── README.md                      # This file
```

---

## Execution Instructions

### Run All Tests (Default Browser - Chrome)
```bash
npm test
```

### Run Tests in Parallel
```bash
npm run test:parallel
```

### Run Tests on Specific Browser

#### Chrome
```bash
npm run test:chrome
```

#### Firefox
```bash
npm run test:firefox
```

#### Edge
```bash
npm run test:edge
```

### Run Tests on All Browsers Sequentially
```bash
npm run test:all-browsers
```

### Run Tests with Specific Tags

#### Smoke Tests
```bash
npx cucumber-js --tags "@smoke"
```

#### Regression Tests
```bash
npx cucumber-js --tags "@regression"
```

#### Positive Test Cases
```bash
npx cucumber-js --tags "@positive"
```

#### Negative Test Cases
```bash
npx cucumber-js --tags "@negative"
```

#### UI Tests Only
```bash
npx cucumber-js --tags "@ui"
```

#### Multiple Tags (AND)
```bash
npx cucumber-js --tags "@smoke and @ui"
```

#### Multiple Tags (OR)
```bash
npx cucumber-js --tags "@smoke or @regression"
```

### Run Specific Feature File
```bash
npx cucumber-js src/features/login.feature
```

### Run Specific Scenario by Line Number
```bash
npx cucumber-js src/features/login.feature:11
```

### Run Tests in Headless Mode
```bash
HEADLESS=true npm test
```

### Run Tests with Retry
```bash
RETRY_COUNT=2 npm test
```

### Clean Previous Reports
```bash
npm run clean
```

---

## Viewing Reports

### HTML Reports

After test execution, reports are automatically generated in the `reports/` directory.

#### View Cucumber HTML Report
1. Navigate to the `reports/` folder
2. Open `cucumber-report.html` in a browser
3. Or run from command line:
   ```bash
   # Windows
   start reports/cucumber-report.html
   
   # Mac
   open reports/cucumber-report.html
   
   # Linux
   xdg-open reports/cucumber-report.html
   ```

### JSON Reports

Raw JSON reports are also generated for further processing:
- Location: `reports/cucumber-report.json`
- Use for custom report generation or integration with CI/CD tools

### Report Features
- **Scenario Status**: Pass/Fail/Skip indicators
- **Execution Time**: Duration for each scenario and step
- **Screenshots**: Attached screenshots for failed scenarios
- **Error Details**: Stack traces and error messages
- **Tag Summary**: Tests grouped by tags
- **Browser Info**: Browser and environment details
- **Timeline View**: Visual timeline of test execution

### Screenshots & Videos

Failed test artifacts are saved in `test-results/`:
```
test-results/
├── screenshots/
│   └── failed-scenario-{timestamp}.png
└── videos/
    └── test-recording-{timestamp}.webm
```

### Report Structure
```
reports/
├── cucumber-report.html      # Main HTML report
├── cucumber-report.json      # Raw JSON data
└── assets/                   # Report assets (CSS, JS, images)
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline configured in `.github/workflows/ci-cd.yml`.

### Pipeline Stages

#### 1. **Code Quality Check**
- TypeScript type checking
- Runs on every push and pull request
- Ensures code quality before running tests

#### 2. **Multi-Browser Testing**
Parallel test execution on:
- Chrome (Chromium)
- Firefox
- Edge

#### 3. **Report Generation**
- Automatic report generation after test execution
- Reports uploaded as artifacts
- Retained for 30 days

### Trigger Events

#### Automatic Triggers
- **Push to Main**: Runs full pipeline on push to main branch
- **Pull Requests**: Runs on PR creation/update to main branch

#### Manual Trigger
- **Workflow Dispatch**: Manually trigger with browser selection
  1. Go to Actions tab in GitHub
  2. Select "Automation Test CI/CD Pipeline"
  3. Click "Run workflow"
  4. Choose browser: chrome, firefox, edge, or all-browsers

### Pipeline Features
- **Parallel Execution**: Tests run in parallel across browsers
- **Artifact Upload**: Reports and screenshots uploaded automatically
- **Retention Policy**: Artifacts kept for 30 days
- **Continue on Error**: Pipeline continues even if tests fail
- **Browser Dependencies**: Automatic Playwright browser installation
- **Caching**: npm dependencies cached for faster builds

### Viewing CI/CD Results

1. **Navigate to Actions Tab**
   - Go to your GitHub repository
   - Click on "Actions" tab

2. **View Pipeline Runs**
   - See all workflow runs with status indicators
   - Click on a run to see detailed logs

3. **Download Artifacts**
   - Scroll to "Artifacts" section in completed workflow
   - Download reports for each browser:
     - `chrome-test-reports`
     - `firefox-test-reports`
     - `edge-test-reports`

4. **View Test Summary**
   - Pipeline summary shows test pass/fail counts
   - Duration of each job
   - Links to artifacts

### Environment Variables in CI/CD

Set these secrets in GitHub repository settings:
```
Settings → Secrets and variables → Actions → New repository secret
```

Required secrets:
- `TEST_USERNAME`: Application username
- `TEST_PASSWORD`: Application password
- `BASE_URL`: Application URL (optional, uses default if not set)

### Pipeline Configuration

Customize pipeline behavior by modifying `.github/workflows/ci-cd.yml`:
- Change Node.js version
- Modify browser list
- Adjust parallel execution count
- Update artifact retention period
- Add additional jobs (security scanning, performance testing, etc.)

---

## Environment Configuration

### Configuration Options

The framework supports extensive configuration through environment variables and the `environment.ts` file.

### Available Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ENV` | `dev` | Environment name |
| `BASE_URL` | `https://development.prism.deepstain.com/` | Application URL |
| `TEST_USERNAME` | `pictor.newqa.guest@pictorlabs.ai` | Login username |
| `TEST_PASSWORD` | `MUT!RHrc6a!@4Fp` | Login password |
| `BROWSER` | `chromium` | Browser: chromium, firefox, webkit |
| `HEADLESS` | `false` | Run in headless mode |
| `SLOW_MO` | `0` | Slow down actions (ms) |
| `TIMEOUT` | `30000` | Default timeout (ms) |
| `PARALLEL_WORKERS` | `3` | Number of parallel workers |
| `RETRY_COUNT` | `1` | Retry failed tests |
| `SCREENSHOT_ON_FAILURE` | `true` | Capture screenshot on failure |
| `VIDEO_ON_FAILURE` | `false` | Record video on failure |

### Configuration Priority

1. **Environment Variables** (`.env` file or system env vars) - Highest priority
2. **Default Values** (defined in `environment.ts`) - Fallback

### Example Configurations

#### Development Environment
```env
ENV=dev
BASE_URL=https://development.prism.deepstain.com/
HEADLESS=false
```

#### Staging Environment
```env
ENV=staging
BASE_URL=https://staging.prism.deepstain.com/
HEADLESS=false
```

#### Production Environment
```env
ENV=prod
BASE_URL=https://prism.deepstain.com/
HEADLESS=true
PARALLEL_WORKERS=5
```

#### Debug Mode
```env
HEADLESS=false
SLOW_MO=1000
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
```

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests locally
4. Submit a pull request

---

## License

ISC License

---

## Contact

For questions or support, please contact the development team.

---

## Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npx playwright install

# 3. Run tests
npm test

# 4. View reports
start reports/cucumber-report.html
```

---

**Happy Testing!**
