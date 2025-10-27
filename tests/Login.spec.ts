import {test} from "../fixture/test-fixture";
import {expect} from "@playwright/test";
import {user} from "../Data/Users";



test.describe("Comprando Eletronicos", () => {
    test.beforeEach(async ({homePage}) => {
        await homePage.goToSwagLabs()

    })

    test("Comprando Bolsa e Lanterna de Bicleta", async ({homePage, productsPage, carrinhoPage, checkoutPage}): Promise<void> => {
        await homePage.login(user.USER, user.PASSWORD);
        await productsPage.selecionarProduto("add-to-cart-sauce-labs-backpack")
        await productsPage.clickIconeCarrinho()
        await productsPage.validaProdutoAdicionado("remove-sauce-labs-backpack")
        await carrinhoPage.clickCheckout()
        await checkoutPage.preencheFormulario()
        await checkoutPage.clickContinue()
        await checkoutPage.validaPaginaCheckoutOverview("inventory-item-name", "Sauce Labs Backpack")







    })

})