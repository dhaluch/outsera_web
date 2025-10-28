import {test} from "../fixture/test-fixture";
import {expect} from "@playwright/test";
import {user} from "../Data/Users";



test.describe("Comprando Eletronicos", () => {
    test.beforeEach(async ({homePage}) => {
        await homePage.goToSwagLabs()

    })

    test("Comprando Bolsa e Lanterna de Bicleta", async ({homePage, productsPage, carrinhoPage, checkoutPage}): Promise<void> => {
        // Verificação das credenciais para falha rápida e logs úteis no CI
        const hasUser = !!user.USER;
        const hasPassword = !!user.PASSWORD;
        console.log(`Credentials present? user: ${hasUser ? 'yes' : 'no'}, password: ${hasPassword ? 'yes' : 'no'}`);
        if (!hasUser || !hasPassword) {
            throw new Error('Credenciais ausentes: verifique os secrets/variáveis de ambiente (SAUCE_USER / SAUCE_SENHA) no CI.');
        }

        await homePage.login(user.USER as string, user.PASSWORD as string);
        await productsPage.selecionarProduto("add-to-cart-sauce-labs-backpack")
        await productsPage.clickIconeCarrinho()
        await productsPage.validaProdutoAdicionado("remove-sauce-labs-backpack")
        await carrinhoPage.clickCheckout()
        await checkoutPage.preencheFormulario()
        await checkoutPage.clickContinue()
        await checkoutPage.validaPaginaCheckoutOverview("inventory-item-name", "Sauce Labs Backpack")







    })

})