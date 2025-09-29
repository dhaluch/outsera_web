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
        this.inputUsername = page.locator("#Email")
        this.inputPassword = page.locator("#Password")
        this.btnLogin = page.locator(".buttons button[type='submit']")
        this.Computers = page.locator(".notmobile a[href=\"/computers\"]")
        this.Desktops = page.locator(".notmobile  a[href=\"/desktops\"]")


    }

    async goToNopCommerce(): Promise<void> {

        await this.page.goto("https://demo.nopcommerce.com/login?returnUrl=%2F")

    }

    async login(username: string, password: string): Promise<void> {
        await this.inputUsername.fill(username)
        await this.inputPassword.fill(password)
        await this.btnLogin.click()


    }
    async comprarDesktop(): Promise<void> {
        await this.Computers.click()
        await this.Desktops.click()

    }


}