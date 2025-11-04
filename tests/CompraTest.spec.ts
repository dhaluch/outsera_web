import {test} from "../fixture/test-fixture";
import {user} from "../Data/Users";
import {allure} from "allure-playwright";
import {expect} from "@playwright/test";

test.describe("Fluxo de compras", () => {

    test.beforeEach(async ({homePage}) => {
        allure.parentSuite('Compras');
        await homePage.goToSwagLabs()
        // Verificação das credenciais para falha rápida e logs úteis no CI
        const hasUser = !!user.USER;
        const hasPassword = !!user.PASSWORD;
        console.log(`Credentials present? user: ${hasUser ? 'yes' : 'no'}, password: ${hasPassword ? 'yes' : 'no'}`);
        if (!hasUser || !hasPassword) {
            throw new Error('Credenciais ausentes: verifique os secrets/variáveis de ambiente (SAUCE_USER / SAUCE_SENHA) no CI.');
        }

    })

    test("Comprando Sauce Labs BackPack", async ({homePage, productsPage, carrinhoPage, checkoutPage, page}): Promise<void> => {

        await homePage.login(user.USER as string, user.PASSWORD as string);
        await productsPage.selecionarProduto("add-to-cart-sauce-labs-backpack")
        await productsPage.clickIconeCarrinho()
        await productsPage.validaProdutoAdicionado("remove-sauce-labs-backpack")
        await carrinhoPage.clickCheckout()
        await checkoutPage.preencheFormulario()
        await checkoutPage.clickContinue()
        await checkoutPage.validaPaginaCheckoutOverview("inventory-item-name", "Sauce Labs Backpack")
        await checkoutPage.clickFinish();
        await expect(page.locator('[data-test="complete-header"]'),
            'A mensagem de confirmação do pedido deveria ser exibida após finalizar a compra. Verifique se o botão "Finish" foi clicado corretamente.'
        ).toHaveText('Thank you for your order!')

    })
    test("Iniciando a compra Bike light e cancelando", async ({homePage, productsPage, carrinhoPage, checkoutPage, page}): Promise<void> => {

        await homePage.login(user.USER as string, user.PASSWORD as string);
        await productsPage.selecionarProduto("add-to-cart-sauce-labs-bike-light")
        await productsPage.clickIconeCarrinho()
        await productsPage.validaProdutoAdicionado("remove-sauce-labs-bike-light")
        await carrinhoPage.clickCheckout()
        await checkoutPage.preencheFormulario()
        await checkoutPage.clickContinue()
        await checkoutPage.clickCancelar()
        await expect(page,
            'Após cancelar o checkout, o usuário deveria retornar à página de produtos (inventory). URL esperada: https://www.saucedemo.com/inventory.html'
        ).toHaveURL('https://www.saucedemo.com/inventory.html')

    })
    test("Validacao campos obrigatorio formulario de checkout.", async ({homePage, productsPage, carrinhoPage, checkoutPage, page}): Promise<void> => {

        await homePage.login(user.USER as string, user.PASSWORD as string);
        await productsPage.selecionarProduto("add-to-cart-sauce-labs-bike-light")
        await productsPage.clickIconeCarrinho()
        await productsPage.validaProdutoAdicionado("remove-sauce-labs-bike-light")
        await carrinhoPage.clickCheckout()
        await checkoutPage.clickContinue()
        await expect(page.locator('[data-test="error"]'),
            'Ao tentar continuar o checkout sem preencher os campos obrigatórios, deveria exibir mensagem de erro indicando que "First Name is required"'
        ).toHaveText('Error: First Name is required')

    })


})