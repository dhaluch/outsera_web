import {expect, Locator, Page} from "@playwright/test";


export class HomePage {
    private readonly page: Page
    private readonly inputUsername: Locator
    private readonly inputPassword: Locator
    private readonly btnLogin: Locator
    private readonly Computers: Locator
    private readonly Desktops: Locator



    constructor(page: Page) {
        this.page = page
        this.inputUsername = page.locator("#user-name")
        this.inputPassword = page.locator("#password")
        this.btnLogin = page.locator("#login-button")



    }

    async goToSwagLabs(): Promise<void> {

        await this.page.goto("https://www.saucedemo.com/")

    }

    async login(username: string, password: string): Promise<void> {
        // Wait for username input to be visible to avoid racing/focus issues
        await this.inputUsername.waitFor({ state: 'visible', timeout: 5000 });

        // Fill the inputs (use empty string fallback to avoid passing undefined)
        await this.inputUsername.fill(username ?? '');
        await this.inputPassword.fill(password ?? '');

        // Click login and wait for the products page to appear (avoid race/timeouts)
        await Promise.all([
            this.page.waitForURL('**/inventory.html', { timeout: 5000 }).catch(() => null),
            this.page.waitForSelector('.inventory_list', { state: 'visible', timeout: 5000 }).catch(() => null),
            this.btnLogin.click()
        ]);

    }


}