import {expect, Locator, Page} from "@playwright/test";

/**
 * CarrinhoPage - Page Object para a página do carrinho de compras
 *
 * @description
 * Esta classe encapsula todos os elementos e ações relacionadas à página do carrinho
 * de compras (cart) do Sauce Demo. Gerencia a navegação do carrinho para o checkout
 * e permite visualizar os produtos adicionados.
 *
 * @responsibility
 * - Navegação da página do carrinho para o checkout
 * - Interação com elementos do carrinho de compras
 * - Gerenciamento do fluxo de finalização de compra
 * @note Esta página é acessada após clicar no ícone do carrinho na página de produtos
 */
export class CarrinhoPage {
    /**
     * Instância da página do Playwright
     * @private
     */
    private page: Page;

    /**
     * Botão "Checkout" que inicia o processo de finalização da compra
     * Seletor: #checkout
     * @private
     */
    private readonly btnCheckout: Locator;

    /**
     * Construtor da classe CarrinhoPage
     *
     * @param {Page} page - Instância da página do Playwright
     *
     * @description
     * Inicializa os locators dos elementos da página do carrinho.
     * Nesta versão, apenas o botão de checkout é necessário para prosseguir
     * com o fluxo de compra.
     */
    constructor(page: Page) {
        this.page = page
        this.btnCheckout = page.locator("#checkout")
    }

    /**
     * Clica no botão "Checkout" para iniciar o processo de finalização da compra
     *
     * @returns {Promise<void>}
     *
     * @description
     * Navega da página do carrinho para a página de checkout (checkout-step-one.html)
     * onde o usuário deverá preencher informações pessoais (nome, sobrenome, CEP).
     *
     * Este método deve ser chamado após o usuário ter adicionado pelo menos um
     * produto ao carrinho e estar visualizando a página do carrinho.

     */
    async clickCheckout(): Promise<void> {
        await this.btnCheckout.click()
    }
}
