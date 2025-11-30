import { BrowserContext } from '@playwright/test';
import { Logger } from './logger';
import path from 'path';
import fs from 'fs';

const logger = new Logger('AuthHelper');

// Manages authentication state persistence for session reuse
export class AuthHelper {
  private static readonly AUTH_DIR = path.join(process.cwd(), '.auth');
  private static readonly AUTH_FILE = path.join(AuthHelper.AUTH_DIR, 'user.json');

  // Save browser context state including cookies and local storage
  static async saveAuthState(context: BrowserContext): Promise<void> {
    try {
      if (!fs.existsSync(this.AUTH_DIR)) {
        fs.mkdirSync(this.AUTH_DIR, { recursive: true });
        logger.info(`Created auth directory: ${this.AUTH_DIR}`);
      }

      await context.storageState({ path: this.AUTH_FILE });
      logger.info(`Authentication state saved to: ${this.AUTH_FILE}`);
    } catch (error) {
      logger.error(`Failed to save auth state: ${error}`);
      throw error;
    }
  }

  static loadAuthState(): any | undefined {
    try {
      if (fs.existsSync(this.AUTH_FILE)) {
        const authState = JSON.parse(fs.readFileSync(this.AUTH_FILE, 'utf-8'));
        logger.info(`Authentication state loaded from: ${this.AUTH_FILE}`);
        return authState;
      } else {
        logger.info('No saved auth state found');
        return undefined;
      }
    } catch (error) {
      logger.error(`Failed to load auth state: ${error}`);
      return undefined;
    }
  }

  static hasAuthState(): boolean {
    const exists = fs.existsSync(this.AUTH_FILE);
    logger.info(`Auth state exists: ${exists}`);
    return exists;
  }

  static deleteAuthState(): void {
    try {
      if (fs.existsSync(this.AUTH_FILE)) {
        fs.unlinkSync(this.AUTH_FILE);
        logger.info(`Deleted auth state file: ${this.AUTH_FILE}`);
      }
      
      if (fs.existsSync(this.AUTH_DIR) && fs.readdirSync(this.AUTH_DIR).length === 0) {
        fs.rmdirSync(this.AUTH_DIR);
        logger.info(`Removed empty auth directory: ${this.AUTH_DIR}`);
      }
    } catch (error) {
      logger.error(`Failed to delete auth state: ${error}`);
    }
  }

  static getAuthFilePath(): string {
    return this.AUTH_FILE;
  }

  static getAuthDirPath(): string {
    return this.AUTH_DIR;
  }
}
