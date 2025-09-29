import {expect, Locator, Page} from "@playwright/test";

export class HomeLocators{
    private readonly page: Page
    private login: Locator


    constructor(page: Page) {
        this.page = page
        this.login = page.locator("button[value='Log in']");

    }
}