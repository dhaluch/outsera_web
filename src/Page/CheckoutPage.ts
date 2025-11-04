import {expect, Locator, Page} from "@playwright/test";

/**
 * CheckoutPage - Page Object para as páginas de checkout (finalização de compra)
 *
 * @description
 * Esta classe encapsula todos os elementos e ações relacionadas às páginas de checkout
 * do Sauce Demo, incluindo:
 * - Checkout Step One: Preenchimento de informações pessoais (nome, sobrenome, CEP)
 * - Checkout Step Two: Revisão do pedido (Checkout Overview)
 * - Checkout Complete: Confirmação do pedido
 *
 * Gerencia todo o fluxo desde o preenchimento do formulário até a finalização da compra,
 * incluindo validações e opção de cancelamento.
 *
 * @responsibility
 * - Preenchimento do formulário de informações pessoais
 * - Continuação para a página de revisão do pedido
 * - Validação dos produtos na página de overview
 * - Finalização da compra
 * - Cancelamento do processo de checkout
 */
export class CheckoutPage {
    /**
     * Instância da página do Playwright
     * @private
     */
    private page: Page;

    /**
     * Campo de entrada para o primeiro nome (First Name)
     * Seletor: #first-name
     * @private
     */
    private readonly firstName: Locator;

    /**
     * Campo de entrada para o sobrenome (Last Name)
     * Seletor: #last-name
     * @private
     */
    private readonly lastName: Locator;

    /**
     * Campo de entrada para o código postal (Postal Code / ZIP)
     * Seletor: #postal-code
     * @private
     */
    private readonly postalCode: Locator;

    /**
     * Botão "Continue" que avança para a página de revisão do pedido
     * Seletor: input[name='continue']
     * @private
     */
    private readonly btnContinue: Locator;

    /**
     * Botão "Finish" que finaliza o pedido
     * Seletor: #finish
     * @private
     */
    private readonly btnFinish: Locator;

    /**
     * Botão "Cancel" que cancela o processo de checkout
     * Seletor: button[name='cancel']
     * @private
     */
    private readonly btnCancelar: Locator;

    /**
     * Construtor da classe CheckoutPage
     *
     * @param {Page} page - Instância da página do Playwright
     *
     * @description
     * Inicializa todos os locators dos elementos das páginas de checkout.
     * Os locators são definidos para cobrir todas as etapas do checkout:
     * - Campos do formulário (Step One)
     * - Botões de navegação (Continue, Finish, Cancel)
     *
     * @example
     * ```typescript
     * const checkoutPage = new CheckoutPage(page);
     * ```
     */
    constructor(page: Page) {
        this.page = page
        this.firstName = page.locator("#first-name")
        this.lastName = page.locator("#last-name")
        this.postalCode = page.locator("#postal-code")
        this.btnContinue = page.locator("input[name='continue']")
        this.btnFinish = page.locator("#finish")
        this.btnCancelar = page.locator("button[name='cancel']")
    }

    /**
     * Preenche o formulário de informações pessoais do checkout
     *
     * @returns {Promise<void>}
     *
     * @description
     * Preenche os três campos obrigatórios do formulário de checkout (Step One):
     * - First Name: "Teste"
     * - Last Name: "Automatizado"
     * - Postal Code: "12345-678"
     *
     * Os valores são fixos para fins de testes automatizados. Em um cenário real,
     * esses valores poderiam ser parametrizados ou gerados dinamicamente.
     */
    async preencheFormulario(): Promise<void> {
        await this.firstName.fill("Teste")
        await this.lastName.fill("Automatizado")
        await this.postalCode.fill("12345-678")
    }

    /**
     * Clica no botão "Continue" para avançar para a página de revisão do pedido
     *
     * @returns {Promise<void>}
     *
     * @description
     * Após preencher o formulário de informações pessoais, este método avança
     * para a página de Checkout Overview (checkout-step-two.html) onde o usuário
     * pode revisar os produtos, quantidades, preços e informações de pagamento.
     *
     * @throws {Error} Se os campos obrigatórios não estiverem preenchidos
     * @see {@link preencheFormulario} - Deve ser chamado antes deste método
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click()
    }

    /**
     * Valida se o produto correto está sendo exibido na página de Checkout Overview
     *
     * @param {string} locatorProduto - Atributo data-test do elemento do produto (ex: 'inventory-item-name')
     * @param {string} produtoComprado - Nome esperado do produto (ex: 'Sauce Labs Backpack')
     * @returns {Promise<void>}
     *
     * @description
     * Verifica se o produto correto está listado na página de revisão do pedido
     * (Checkout Overview). Usa assertion do Playwright (expect...toHaveText) que
     * aguarda automaticamente até que o texto corresponda ou timeout seja atingido.
     * @throws {AssertionError} Se o texto do produto não corresponder ao esperado
     * );
     */
    async validaPaginaCheckoutOverview(locatorProduto: string, produtoComprado: string): Promise<void> {
        // Use an attribute selector for data-test and let Playwright wait using toHaveText
        const locator = this.page.locator(`[data-test="${locatorProduto}"]`)
        await expect(locator).toHaveText(produtoComprado)
    }

    /**
     * Clica no botão "Finish" para finalizar o pedido
     *
     * @returns {Promise<void>}
     *
     * @description
     * Finaliza o processo de compra clicando no botão "Finish".
     * Após este método, o usuário é redirecionado para a página de confirmação
     * (checkout-complete.html) que exibe a mensagem "Thank you for your order!".
     *
     * Este é o último passo do fluxo de compra bem-sucedido.
     *
     * // Validar mensagem de sucesso
     * await expect(page.locator('[data-test="complete-header"]'))
     *   .toHaveText('Thank you for your order!');
     * ```
     */
    async clickFinish(): Promise<void> {
        await this.btnFinish.click()
    }

    /**
     * Clica no botão "Cancel" para cancelar o processo de checkout
     *
     * @returns {Promise<void>}
     *
     * @description
     * Cancela o processo de checkout e retorna o usuário para a página de produtos
     * (inventory.html). Este método pode ser usado em qualquer etapa do checkout
     * (Step One ou Step Two).
     *
     * O cancelamento não remove os produtos do carrinho - eles permanecem
     * disponíveis para uma nova tentativa de checkout.
     *
     * // Validar que retornou para a página de produtos
     * await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
     */
    async clickCancelar(): Promise<void> {
        await this.btnCancelar.click()
    }
}
