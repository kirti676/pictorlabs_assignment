import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Environment configuration interface
export interface EnvironmentConfig {
  env: string;
  baseUrl: string;
  username: string;
  password: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  slowMo: number;
  timeout: number;
  parallelWorkers: number;
  retryCount: number;
  screenshotOnFailure: boolean;
  videoOnFailure: boolean;
}

// Centralized environment configuration manager
class Environment {
  private config: EnvironmentConfig;

  // Load configuration from environment variables with defaults
  constructor() {
    this.config = {
      env: process.env.ENV || 'dev',
      baseUrl: process.env.BASE_URL || 'https://development.prism.deepstain.com/',
      username: process.env.TEST_USERNAME || process.env.APP_USERNAME || 'pictor.newqa.guest@pictorlabs.ai',
      password: process.env.TEST_PASSWORD || process.env.APP_PASSWORD || 'MUT!RHrc6a!@4Fp',
      browser: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
      headless: process.env.HEADLESS === 'true',
      slowMo: parseInt(process.env.SLOW_MO || '0'),
      timeout: parseInt(process.env.TIMEOUT || '30000'),
      parallelWorkers: parseInt(process.env.PARALLEL_WORKERS || '3'),
      retryCount: parseInt(process.env.RETRY_COUNT || '1'),
      screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
      videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
    };
  }

  public get(key: keyof EnvironmentConfig): any {
    return this.config[key];
  }

  public getAll(): EnvironmentConfig {
    return this.config;
  }

  public getBrowserConfig() {
    return {
      browserName: this.config.browser,
      headless: this.config.headless,
      slowMo: this.config.slowMo,
      timeout: this.config.timeout,
    };
  }
}

export const environment = new Environment();
