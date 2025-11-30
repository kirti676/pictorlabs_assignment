import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { error } from 'console';

// Login page with authentication and error handling
export class LoginPage extends BasePage {
    private readonly signInButton: Locator;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly usernameErrorMessage: Locator;
    private readonly passwordErrorMessage: Locator;
    private readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');

        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.usernameInput = page.locator('//input[@id="username"]');
        this.passwordInput = page.locator('//input[@id="password"]');
        this.loginButton = page.locator('//button[normalize-space(text())="Continue"]');
        this.errorMessage = page.locator('//span[@id="error-element-password"]');
        this.usernameErrorMessage = page.locator('#error-cs-username-required');
        this.passwordErrorMessage = page.locator('#error-cs-password-required');
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    }

    async navigateToLoginPage(url: string): Promise<void> {
        this.logger.step('Navigate to login page');
        await this.navigate(url);
        await this.click(this.signInButton, 'Sign In Button');
    }

    async enterUsername(username: string): Promise<void> {
        this.logger.action(`Enter username: ${username}`);
        await this.fill(this.usernameInput, username, 'Username Input');
    }

    async enterPassword(password: string): Promise<void> {
        this.logger.action('Enter password');
        await this.fill(this.passwordInput, password, 'Password Input');
    }

    async clickLoginButton(): Promise<void> {
        this.logger.action('Click login button');
        await this.click(this.loginButton, 'Login Button');
        await this.page.waitForLoadState('networkidle');
    }

    async getErrorMessage(): Promise<string> {
        this.logger.action('Get error message');
        await this.waitForElement(this.errorMessage, 5000, 'Error Message');
        return await this.getInnerText(this.errorMessage, 'Error Message');
    }

    async isErrorMessageVisible(): Promise<boolean> {
        return await this.isVisible(this.errorMessage, 'Error Message');
    }

    // Collect all visible error messages from form
    async getAllErrorMessages(): Promise<string> {
        this.logger.action('Get all visible error messages');
        const errors: string[] = [];

        const isUsernameErrorVisible = await this.isVisible(this.usernameErrorMessage, 'Username Error Message');
        if (isUsernameErrorVisible) {
            await this.waitForElement(this.usernameErrorMessage, 5000, 'Username Error Message');
            errors.push(await this.getInnerText(this.usernameErrorMessage, 'Username Error Message'));
        }

        const isPasswordErrorVisible = await this.isVisible(this.passwordErrorMessage, 'Password Error Message');
        if (isPasswordErrorVisible) {
            await this.waitForElement(this.passwordErrorMessage, 5000, 'Password Error Message');
            errors.push(await this.getInnerText(this.passwordErrorMessage, 'Password Error Message'));
        }

        return errors.join(', ');
    }
    
    async waitForSuccessfulLogin(timeout: number = 10000): Promise<void> {
        this.logger.action('Wait for successful login');
        await this.page.waitForLoadState('networkidle', { timeout });
    }
}
