import {expect, Locator, Page} from "@playwright/test";

export class DesktopsPage {
    private readonly page: Page
    private readonly desktop: Locator
    private search: String
    constructor(page: Page) {
        this.page = page
        this.desktop = page.locator("a[href='"+this.search+"']")
    }
    async selecionarDesktop(search: String): Promise<void> {
        this.search = search
        this.search.toLowerCase()
        this.search.replace(" ", "-")
        await this.desktop.click()

    }

}