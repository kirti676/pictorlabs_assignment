import fs from 'fs';
import path from 'path';

// Utility to load and access test data from JSON files
export class DataHelper {
  private static testData: any;

  // Load test data from JSON file
  static loadTestData(filename: string = 'testData.json'): any {
    const filepath = path.join(process.cwd(), 'src', 'data', filename);
    
    if (!fs.existsSync(filepath)) {
      throw new Error(`Test data file not found: ${filepath}`);
    }

    const rawData = fs.readFileSync(filepath, 'utf-8');
    this.testData = JSON.parse(rawData);
    return this.testData;
  }

  // Access nested data using dot notation (e.g., 'login.validUser')
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

  static getAllData(): any {
    if (!this.testData) {
      this.loadTestData();
    }
    return this.testData;
  }

  static getLoginCredentials(userType: string = 'validUser'): { username: string; password: string; message: string } {
    return this.getData(`login.${userType}`);
  }

  static getUserById(userId: number): any {
    const users = this.getData('users');
    return users.find((user: any) => user.id === userId);
  }

  static getRandomUser(): any {
    const users = this.getData('users');
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }

  static getErrorMessage(key: string): string {
    return this.getData(`errorMessages.${key}`);
  }

  static getTimeout(key: string): number {
    return this.getData(`timeouts.${key}`);
  }
}
