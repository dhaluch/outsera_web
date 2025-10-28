# Outsera Web — Testes Playwright

Este repositório contém uma suíte de testes end-to-end (E2E) automáticos para a aplicação Demo Sauce (saucedemo.com), implementada com Playwright. O README explica o que os testes validam, a arquitetura do projeto, dependências, versões utilizadas e como executar os testes localmente e no CI (GitHub Actions).

## Sumário
- Nome do projeto e descrição breve
- Tipo de teste e o que foi validado
- Arquitetura / Estrutura de pastas
- Versões utilizadas
- Dependências e como instalar
- Como executar os testes localmente
- Como gerar e abrir o relatório
- Execução no GitHub Actions (resumo)

---

## Nome do projeto
Outsera Web — Testes E2E com Playwright

## Descrição breve
Suíte de testes automatizados (E2E/UI) que valida fluxo de compra no site de demonstração Sauce Demo: login, adição de produto ao carrinho, checkout e validação do item no resumo.

## Tipo de teste e o que foi validado
- Tipo: Testes end-to-end (E2E) de interface (UI) utilizando Playwright (`@playwright/test`).
- Principais validações:
  - Login com usuário/senha válidos.
  - Seleção/adicionar produto ao carrinho.
  - Navegação para o carrinho e início do checkout.
  - Preenchimento do formulário de checkout e continuação.
  - Validação do nome do produto na página de resumo (ex.: `Sauce Labs Backpack`).
  - Captura de screenshot e vídeo em caso de falha (configurado no `playwright.config.ts`).

## Arquitetura / Estrutura de pastas
Estrutura principal do repositório (resumida):

```
package.json
playwright.config.ts
README.md
Data/
  Users.ts
fixture/
  test-fixture.ts
src/
  Page/
    homePage.ts
    ProductsPage.ts
    CarrinhoPage.ts
    CheckoutPage.ts
tests/
  Login.spec.ts
  example.spec.ts
.playwright-report/  (gerado após execução)
test-results/       (screenshots/videos gerados em falhas)
.github/workflows/
  playwright-tests.yml
```

- `Data/Users.ts` — leitura de credenciais via `dotenv` / `process.env`.
- `src/Page` — implementações das Page Objects (Home, Products, Carrinho, Checkout).
- `tests/` — specs de testes Playwright.
- `playwright.config.ts` — configurações do Playwright (reporter HTML, timeouts, captura de vídeo/screenshot on-failure, trace on retry).
- `.github/workflows/playwright-tests.yml` — workflow para CI no GitHub Actions (executa testes e faz upload do `playwright-report`).

## Versões utilizadas
(Verificar `package.json` para versões exatas; listado aqui conforme o projeto atual):
- Node.js: 18.x (recomendado)
- @playwright/test: ^1.55.1
- dotenv: ^17.2.2
- TypeScript: via `@types/node` (ambiente de desenvolvimento)

## Dependências (como instalar)
1. Tenha Node.js 18 instalado.
2. Na raiz do projeto, rode:

```bash
npm ci
```

3. Instale navegadores Playwright (somente 1 vez ou em CI):

```bash
npx playwright install --with-deps
```

## Variáveis de ambiente / Credenciais
- Localmente, use um arquivo `.env` na raiz com:

```dotenv
USER=standard_user
SENHA=secret_sauce
```

- No GitHub Actions, configure secrets no repositório (Settings → Secrets and variables → Actions):
  - `SAUCE_USER`  — username
  - `SAUCE_SENHA` — senha

O código `Data/Users.ts` prefere `SAUCE_USER`/`SAUCE_SENHA` (para CI) e usa `USER`/`SENHA` como fallback para desenvolvimento local.

> Segurança: nunca commite um arquivo `.env` com credenciais reais.

## Como executar os testes localmente
- Rodar toda a suíte:

```bash
npx playwright test
```

- Rodar um único spec (ex.: teste de login):

```bash
npx playwright test tests/Login.spec.ts --workers=1
```

- Para ver mais saída durante a execução (verbose), use a opção `-v`/`--reporter` conforme a necessidade, ou abra o relatório HTML após a execução.

## Gerar e abrir o relatório HTML
- O Playwright gera automaticamente um relatório HTML em `playwright-report` quando você executa `npx playwright test` (reporter configurado em `playwright.config.ts`).

- Para abrir o último relatório gerado localmente:

```bash
npx playwright show-report
```

- Em CI (GitHub Actions) o workflow já envia `playwright-report` como artifact; baixe o ZIP do artifact e extraia para abrir `index.html` localmente.

## Captura de screenshots e vídeos
- Configuração atual (`playwright.config.ts`):
  - `screenshot: 'only-on-failure'` — screenshots somente em falhas.
  - `video: 'retain-on-failure'` — vídeo retido apenas quando o teste falha.
- Esses arquivos são enviados como parte do artifact `test-results` no workflow.

## Execução no GitHub Actions (resumo)
- Arquivo: `.github/workflows/playwright-tests.yml`.
- O workflow faz:
  1. Checkout
  2. Setup Node
  3. npm ci
  4. npx playwright install --with-deps
  5. npx playwright test
  6. Upload do `playwright-report` e `test-results` como artifacts
- Caso utilize credenciais no CI, adicione `SAUCE_USER` e `SAUCE_SENHA` como secrets no repositório.

## Dicas para depuração
- Se os testes falharem no CI, baixe o `playwright-report` para inspecionar os passos e abra `test-results` para acessar screenshots e vídeos.
- Ajuste timeouts se necessário em `playwright.config.ts` (a configuração do projeto já aplica um timeout global aumentado).

## Contato / Referências
- Playwright docs: https://playwright.dev
- Dotenv: https://github.com/motdotla/dotenv

---

Se quiser eu:
- adiciono um badge do workflow no topo do README,
- adiciono exemplos de como rodar apenas em `chromium/firefox/webkit` (matriz),
- ou gero um pequeno script `npm` (package.json) para facilitar comandos (ex: `npm run test`, `npm run install-browsers`).

Diga qual extra prefere e eu aplico.

