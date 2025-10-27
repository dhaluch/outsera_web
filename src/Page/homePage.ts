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
        await this.inputUsername.fill(username)
        await this.inputPassword.fill(password)
        await this.btnLogin.click()


    }



}