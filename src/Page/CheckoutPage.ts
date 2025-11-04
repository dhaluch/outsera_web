import {expect, Locator, Page} from "@playwright/test";

//Classe responsável pela página de checkout, com os seletores e métodos necessários..
export class CheckoutPage {
    private page: Page;
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly postalCode: Locator;
    private readonly btnContinue: Locator;
    private readonly btnFinish: Locator;
    private readonly btnCancelar: Locator;
    constructor(page: Page) {
        this.page = page
        this.firstName = page.locator("#first-name")
        this.lastName = page.locator("#last-name")
        this.postalCode = page.locator("#postal-code")
        this.btnContinue = page.locator("input[name='continue']")
        this.btnFinish = page.locator("#finish")
        this.btnCancelar = page.locator("button[name='cancel']")

    }
    async preencheFormulario(): Promise<void> {
        await this.firstName.fill("Teste")
        await this.lastName.fill("Automatizado")
        await this.postalCode.fill("12345-678")
    }
    async clickContinue(): Promise<void> {
        await this.btnContinue.click()
    }
    async validaPaginaCheckoutOverview(locatorProduto: string, produtoComprado: string): Promise<void> {
        // Use an attribute selector for data-test and let Playwright wait using toHaveText
        const locator = this.page.locator(`[data-test="${locatorProduto}"]`)
        await expect(locator).toHaveText(produtoComprado)

    }
    async clickFinish(): Promise<void> {
        await  this.btnFinish.click()
    }
    async clickCancelar(): Promise<void> {
        await  this.btnCancelar.click()
    }

}
