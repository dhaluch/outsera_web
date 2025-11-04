import {expect, Locator, Page} from "@playwright/test";

//Classe responsável pela página de produtos, com os seletores e métodos necessários..
export class ProductsPage {
    private readonly page: Page
    private carrinho:Locator
    private text: string
    private locatorProduto: Locator

    // Keep a reference to the Playwright page and build locators on demand
    constructor(page: Page) {
        this.page = page
        this.carrinho = page.locator('#shopping_cart_container')
    }

    // Build the locator at call time to avoid using an undefined value in the selector
    private productLocator(typeproduct: string): Locator {
        // Use quoted attribute value to avoid CSS parsing issues and escape the value if necessary
        return this.page.locator(`button[name='${typeproduct}']`)
    }

    async selecionarProduto(typeproduct: string): Promise<void> {
        await this.productLocator(typeproduct).click()
    }
    async clickIconeCarrinho(): Promise<void> {
        await this.carrinho.click()
    }
    async validaProdutoAdicionado(locatorProduto: string): Promise<void> {

        //await expect(this.page.locator(`'${locatorProduto}'`)).toHaveText(text, { timeout: 5000 })
        await expect(this.page.locator(`button[name='${locatorProduto}']`)).toBeVisible()
    }

}