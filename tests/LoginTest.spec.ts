import {test} from "../fixture/test-fixture";
import {expect} from "@playwright/test";
import {user} from "../Data/Users";
import { faker } from '@faker-js/faker/locale/en';
import {allure} from "allure-playwright";


test.describe("Validações de Login.", () => {

    test.beforeEach(async ({homePage}) => {
        allure.parentSuite('Login');
        await homePage.goToSwagLabs()

    })

    test("Login Sucesso.", async ({homePage, page}): Promise<void> => {
        // Verificação das credenciais para falha rápida e logs úteis no CI
        const hasUser = !!user.USER;
        const hasPassword = !!user.PASSWORD;
        console.log(`Credentials present? user: ${hasUser ? 'yes' : 'no'}, password: ${hasPassword ? 'yes' : 'no'}`);
        if (!hasUser || !hasPassword) {
            throw new Error('Credenciais ausentes: verifique os secrets/variáveis de ambiente (SAUCE_USER / SAUCE_SENHA) no CI.');
        }

        await homePage.login(user.USER as string, user.PASSWORD as string);
        await expect(page,
            'Após login bem-sucedido com credenciais válidas, o usuário deveria ser redirecionado para a página de produtos (inventory.html). Verifique se as credenciais SAUCE_USER e SAUCE_SENHA estão corretas.'
        ).toHaveURL('https://www.saucedemo.com/inventory.html');








    })
    test("Login  Usuario não cadastrado.", async ({homePage, page}): Promise<void> => {
        // Verificação das credenciais para falha rápida e logs úteis no CI
        await homePage.login(faker.internet.username(), faker.internet.password());
        await expect(page.locator('[data-test="error"]'),
            'Ao tentar fazer login com credenciais inválidas (usuário não cadastrado), deveria exibir mensagem de erro indicando que as credenciais não correspondem a nenhum usuário no sistema.'
        ).toHaveText('Epic sadface: Username and password do not match any user in this service')
    })
    test("Login  Sem preencher Usuario.", async ({homePage, page}): Promise<void> => {
        await homePage.login(" ", faker.internet.password());
        await expect(page.locator('[data-test="error"]'),
            'Ao tentar fazer login sem preencher o campo de usuário (campo vazio ou com espaço), deveria exibir mensagem de erro indicando que as credenciais não correspondem.'
        ).toHaveText('Epic sadface: Username and password do not match any user in this service')







    })
    test("Login  Sem preencher Password", async ({homePage, page}): Promise<void> => {
        await homePage.login(faker.internet.username()," ");
        await expect(page.locator('[data-test="error"]'),
            'Ao tentar fazer login sem preencher o campo de senha (campo vazio ou com espaço), deveria exibir mensagem de erro indicando que as credenciais não correspondem.'
        ).toHaveText('Epic sadface: Username and password do not match any user in this service')







    })
    test("Login  Sem preencher Usuario e Password.", async ({homePage, page}): Promise<void> => {
        await homePage.login(" ", " ");
        await expect(page.locator('[data-test="error"]'),
            'Ao tentar fazer login sem preencher nenhum campo (usuário e senha vazios), deveria exibir mensagem de erro indicando que as credenciais não correspondem.'
        ).toHaveText('Epic sadface: Username and password do not match any user in this service')







    })

})
