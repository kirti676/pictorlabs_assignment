import fs from 'fs';
import path from 'path';

export class DataHelper {
  private static testData: any;

  /**
   * Load test data from JSON file
   */
  static loadTestData(filename: string = 'testData.json'): any {
    const filepath = path.join(process.cwd(), 'src', 'data', filename);
    
    if (!fs.existsSync(filepath)) {
      throw new Error(`Test data file not found: ${filepath}`);
    }

    const rawData = fs.readFileSync(filepath, 'utf-8');
    this.testData = JSON.parse(rawData);
    return this.testData;
  }

  /**
   * Get test data by key path (e.g., 'login.validUser.username')
   */
  static getData(keyPath: string): any {
    if (!this.testData) {
      this.loadTestData();
    }

    const keys = keyPath.split('.');
    let value = this.testData;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        throw new Error(`Key path not found in test data: ${keyPath}`);
      }
    }

    return value;
  }

  /**
   * Get all test data
   */
  static getAllData(): any {
    if (!this.testData) {
      this.loadTestData();
    }
    return this.testData;
  }

  /**
   * Get login credentials
   */
  static getLoginCredentials(userType: string = 'validUser'): { username: string; password: string; message: string } {
    return this.getData(`login.${userType}`);
  }

  /**
   * Get user by id
   */
  static getUserById(userId: number): any {
    const users = this.getData('users');
    return users.find((user: any) => user.id === userId);
  }

  /**
   * Get random user
   */
  static getRandomUser(): any {
    const users = this.getData('users');
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }

  /**
   * Get error message
   */
  static getErrorMessage(key: string): string {
    return this.getData(`errorMessages.${key}`);
  }

  /**
   * Get timeout value
   */
  static getTimeout(key: string): number {
    return this.getData(`timeouts.${key}`);
  }
}
