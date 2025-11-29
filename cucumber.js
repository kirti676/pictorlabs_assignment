const common = {
  requireModule: ['ts-node/register'],
  require: ['src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json'
  ],
  paths: ['src/features/**/*.feature'],
  parallel: 1
};

const chrome = {
  ...common,
  worldParameters: {
    browser: 'chromium'
  }
};

const firefox = {
  ...common,
  worldParameters: {
    browser: 'firefox'
  }
};

const safari = {
  ...common,
  worldParameters: {
    browser: 'webkit'
  }
};

const parallel = {
  ...common,
  parallel: 3
};

module.exports = {
  default: common,
  chrome,
  firefox,
  safari,
  parallel
};
