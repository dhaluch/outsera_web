import {expect, Locator, Page} from "@playwright/test";

export class CarrinhoPage {
    private page: Page;
    private readonly btnCheckout: Locator;
    constructor(page: Page) {
        this.page = page
        this.btnCheckout = page.locator("#checkout")

    }
    async clickCheckout(): Promise<void> {
        await this.btnCheckout.click()
    }
}
