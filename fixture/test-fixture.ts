import {test as baseTest} from "@playwright/test";
import {HomePage} from "../src/Page/homePage";
import {ProductsPage} from "../src/Page/ProductsPage";
import {CarrinhoPage} from "../src/Page/CarrinhoPage";
import {CheckoutPage} from "../src/Page/CheckoutPage";

export interface Pages{
    homePage: HomePage;
    productsPage: ProductsPage;
    carrinhoPage: CarrinhoPage;
    checkoutPage: CheckoutPage;
}

export const test = baseTest.extend<Pages>({
    homePage: async ({page}, use): Promise<void> => {
        await use(new HomePage(page))
    },
    productsPage: async ({page}, use): Promise<void> => {
        await use(new ProductsPage(page))
    },
    carrinhoPage: async ({page}, use): Promise<void> => {
        await use (new CarrinhoPage(page))
    },
    checkoutPage: async ({page}, use): Promise<void> => {
        await use (new CheckoutPage(page))
    }

});

// Removed manual afterEach attachment to let allure-playwright attach artifacts automatically
