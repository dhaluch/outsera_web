import {test} from "../fixture/test-fixture";
import {expect} from "@playwright/test";
import {user} from "../Data/Users";



test.describe("Comprando Eletronicos", () => {
    test.beforeEach(async ({homePage}) => {
        await homePage.goToNopCommerce();

    })

    test("Comprando Desktop", async ({homePage, desktopsPage}): Promise<void> => {
        await homePage.login(user.USER, user.PASSWORD);
        await homePage.comprarDesktop();
        await desktopsPage.selecionarDesktop("Build your own computer");

    })

})