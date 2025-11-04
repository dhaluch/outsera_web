import {expect, Locator, Page} from "@playwright/test";

/**
 * ProductsPage - Page Object para a página de produtos (inventário)
 *
 * @description
 * Esta classe encapsula todos os elementos e ações relacionadas à página de produtos
 * do Sauce Demo. Permite selecionar produtos, adicionar ao carrinho e navegar para
 * o carrinho de compras.
 *
 * @responsibility
 * - Seleção de produtos por identificador
 * - Adicionar produtos ao carrinho
 * - Navegação para o carrinho de compras
 * - Validação de produtos adicionados ao carrinho
 */
/**
 * ProductsPage - Page Object para a página de produtos (inventário)
 *
 * @description
 * Esta classe encapsula todos os elementos e ações relacionadas à página de produtos
 * do Sauce Demo. Permite selecionar produtos, adicionar ao carrinho e navegar para
 * o carrinho de compras.
 *
 * @responsibility
 * - Seleção de produtos por identificador
 * - Adicionar produtos ao carrinho
 * - Navegação para o carrinho de compras
 * - Validação de produtos adicionados ao carrinho
 */
export class ProductsPage {
    /**
     * Instância da página do Playwright
     * @private
     */
    private readonly page: Page

    /**
     * Ícone/link do carrinho de compras no header
     * Seletor: #shopping_cart_container
     * @private
     */
    private carrinho: Locator

    /**
     * Texto auxiliar para validações
     * @private
     */
    private text: string

    /**
     * Locator dinâmico para produtos específicos
     * @private
     */
    private locatorProduto: Locator

    /**
     * Construtor da classe ProductsPage
     *
     * @param {Page} page - Instância da página do Playwright
     *
     * @description
     * Inicializa os locators principais da página de produtos.
     * O locator do carrinho é definido no construtor, enquanto locators
     * de produtos individuais são criados dinamicamente pelo método productLocator().
     * ```
     */
    constructor(page: Page) {
        this.page = page
        this.carrinho = page.locator('#shopping_cart_container')
    }

    /**
     * Cria um locator dinâmico para um produto específico
     *
     * @param {string} typeproduct - Nome do atributo do botão do produto (ex: 'add-to-cart-sauce-labs-backpack')
     * @returns {Locator} Locator do botão do produto
     * @private
     *
     * @description
     * Método auxiliar privado que constrói locators dinâmicos para botões de produtos.
     * Usa o atributo 'name' do botão para localizar o elemento específico.
     * Este padrão evita problemas com seletores indefinidos e permite reutilização.
     */
    private productLocator(typeproduct: string): Locator {
        // Use quoted attribute value to avoid CSS parsing issues and escape the value if necessary
        return this.page.locator(`button[name='${typeproduct}']`)
    }

    /**
     * Seleciona (adiciona ao carrinho) um produto específico
     *
     * @param {string} typeproduct - Identificador do botão do produto a ser selecionado
     * @returns {Promise<void>}
     *
     * @description
     * Localiza o botão "Add to cart" de um produto específico e clica nele.
     * Após o clique, o produto é adicionado ao carrinho e o botão muda para "Remove".
     * @see {@link productLocator} - Método que cria o locator dinâmico
     */
    async selecionarProduto(typeproduct: string): Promise<void> {
        await this.productLocator(typeproduct).click()
    }

    /**
     * Clica no ícone do carrinho de compras no header
     *
     * @returns {Promise<void>}
     *
     * @description
     * Navega para a página do carrinho de compras clicando no ícone do carrinho
     * localizado no header da aplicação. Após o clique, o usuário é redirecionado
     * para a página /cart.html.
     * ```
     */
    async clickIconeCarrinho(): Promise<void> {
        await this.carrinho.click()
    }

    /**
     * Valida se um produto foi adicionado ao carrinho
     *
     * @param {string} locatorProduto - Identificador do botão "Remove" do produto (ex: 'remove-sauce-labs-backpack')
     * @returns {Promise<void>}
     *
     * @description
     * Verifica se o botão "Remove" do produto está visível na página do carrinho.
     * Quando um produto é adicionado ao carrinho, o botão "Add to cart" muda para "Remove",
     * e este método valida essa mudança confirmando que o produto está no carrinho.
     *
     * Usa assertion do Playwright (expect...toBeVisible) que aguarda automaticamente
     * até que o elemento apareça ou timeout seja atingido.
     *
     * @throws {AssertionError} Se o botão "Remove" não estiver visível
     * @note O nome do locator muda de 'add-to-cart-*' para 'remove-*' após adicionar o produto
     */
    async validaProdutoAdicionado(locatorProduto: string): Promise<void> {
        //await expect(this.page.locator(`'${locatorProduto}'`)).toHaveText(text, { timeout: 5000 })
        await expect(this.page.locator(`button[name='${locatorProduto}']`)).toBeVisible()
    }

}