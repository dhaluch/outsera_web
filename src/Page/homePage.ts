import {expect, Locator, Page} from "@playwright/test";

/**
 * HomePage - Page Object para a página inicial e login do Sauce Demo
 *
 * @description
 * Esta classe encapsula todos os elementos e ações relacionadas à página inicial (home)
 * e ao fluxo de autenticação da aplicação Sauce Demo (https://www.saucedemo.com).
 * Implementa o padrão Page Object Model (POM) para facilitar manutenção e reutilização.
 *
 * @responsibility
 * - Navegação para a aplicação
 * - Autenticação de usuários (login)
 * - Interação com elementos da página de login
 * ```
 */
export class HomePage {
    /**
     * Instância da página do Playwright
     * @private
     */
    private readonly page: Page

    /**
     * Campo de entrada para o nome de usuário
     * Seletor: #user-name
     * @private
     */
    private readonly inputUsername: Locator

    /**
     * Campo de entrada para a senha
     * Seletor: #password
     * @private
     */
    private readonly inputPassword: Locator

    /**
     * Botão de login/autenticação
     * Seletor: #login-button
     * @private
     */
    private readonly btnLogin: Locator

    /**
     * Locator para computadores (não utilizado atualmente)
     * @private
     * @deprecated Será removido em versões futuras
     */
    private readonly Computers: Locator

    /**
     * Locator para desktops (não utilizado atualmente)
     * @private
     * @deprecated Será removido em versões futuras
     */
    private readonly Desktops: Locator

    /**
     * Construtor da classe HomePage
     *
     * @param {Page} page - Instância da página do Playwright
     *
     * @description
     * Inicializa todos os locators (seletores) dos elementos da página de login.
     * Os locators são definidos no construtor para otimizar performance e reutilização.
     *
     * @example
     * ```typescript
     * const homePage = new HomePage(page);
     * ```
     */
    constructor(page: Page) {
        this.page = page
        this.inputUsername = page.locator("#user-name")
        this.inputPassword = page.locator("#password")
        this.btnLogin = page.locator("#login-button")
    }

    /**
     * Navega para a página inicial do Sauce Demo
     *
     * @returns {Promise<void>}
     *
     * @description
     * Executa navegação para a URL base da aplicação Sauce Demo.
     * Este método deve ser chamado antes de qualquer interação com a página.
     *
     * @throws {Error} Se a navegação falhar ou timeout for atingido
     */
    async goToSwagLabs(): Promise<void> {
        await this.page.goto("https://www.saucedemo.com/")
    }

    /**
     * Realiza o login na aplicação
     *
     * @param {string} username - Nome de usuário para autenticação
     * @param {string} password - Senha do usuário
     * @returns {Promise<void>}
     *
     * @description
     * Executa o fluxo completo de autenticação:
     * 1. Aguarda o campo de usuário estar visível (evita race conditions)
     * 2. Preenche o nome de usuário
     * 3. Preenche a senha
     * 4. Clica no botão de login
     * 5. Aguarda navegação para a página de produtos ou exibição da lista de inventário
     *
     * O método usa Promise.all para aguardar múltiplas condições em paralelo,
     * com tratamento de erro (.catch) para casos onde o login falha intencionalmente
     * (como em testes de validação de credenciais inválidas).
     *
     * @throws {TimeoutError} Se o campo de usuário não aparecer em 5 segundos
     * @see {@link https://www.saucedemo.com} - Credenciais válidas disponíveis na página
     */
    async login(username: string, password: string): Promise<void> {
        // Wait for username input to be visible to avoid racing/focus issues
        await this.inputUsername.waitFor({ state: 'visible', timeout: 5000 });

        // Fill the inputs (use empty string fallback to avoid passing undefined)
        await this.inputUsername.fill(username ?? '');
        await this.inputPassword.fill(password ?? '');

        // Click login and wait for the products page to appear (avoid race/timeouts)
        await Promise.all([
            this.page.waitForURL('**/inventory.html', { timeout: 5000 }).catch(() => null),
            this.page.waitForSelector('.inventory_list', { state: 'visible', timeout: 5000 }).catch(() => null),
            this.btnLogin.click()
        ]);
    }

}