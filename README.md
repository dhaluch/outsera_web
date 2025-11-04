# 🎯 Outsera Web - Automação de Testes E2E

Projeto de automação de testes end-to-end para a aplicação [Sauce Demo](https://www.saucedemo.com) utilizando Playwright e Allure Reports.

[![Playwright Tests](https://github.com/seu-usuario/outsera_web/actions/workflows/playwright-gh-pages.yml/badge.svg)](https://github.com/seu-usuario/outsera_web/actions/workflows/playwright-gh-pages.yml)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando os Testes](#executando-os-testes)
- [Relatórios Allure](#relatórios-allure)
- [CI/CD Pipeline](#cicd-pipeline)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)

---

## 🎯 Sobre o Projeto

Este projeto contém testes automatizados E2E (End-to-End) para validar funcionalidades críticas da aplicação Sauce Demo, incluindo:

- ✅ **Fluxo de Login** - Validações de autenticação (sucesso, falhas, campos obrigatórios)
- ✅ **Fluxo de Compras** - Adicionar produtos ao carrinho, checkout e finalização
- ✅ **Validações de Formulário** - Campos obrigatórios e mensagens de erro
- ✅ **Cancelamento de Compras** - Fluxo de cancelamento durante o checkout

### Funcionalidades de Relatório

- 📊 **Allure Report** completo com screenshots, vídeos e logs
- 📈 **Trend Graphs** - Histórico de execuções ao longo do tempo
- 🏷️ **Categories** - Categorização automática de falhas (Timeout, Login, Infrastructure, etc.)
- 🌳 **Suites** - Organização hierárquica dos testes (Login, Compras)
- 🎬 **Vídeos e Screenshots** - Evidências visuais de cada execução
- 📝 **Mensagens customizadas** - Assertions com contexto para troubleshooting

---

## 🛠️ Tecnologias

- **[Playwright](https://playwright.dev/)** `^1.56.1` - Framework de automação
- **[TypeScript](https://www.typescriptlang.org/)** `^24.9.2` - Linguagem
- **[Allure Report](https://docs.qameta.io/allure/)** `^3.0.0` - Relatórios visuais
- **[Faker.js](https://fakerjs.dev/)** `^9.9.0` - Geração de dados de teste
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[GitHub Pages](https://pages.github.com/)** - Publicação de relatórios

---

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

- **Node.js** versão 18.x ou superior ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **npm** (incluído com Node.js)

---

## 🚀 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/outsera_web.git
cd outsera_web
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Instale os navegadores do Playwright:**

```bash
npx playwright install --with-deps
```

---

## ⚙️ Configuração

### Variáveis de Ambiente (Local)

Crie um arquivo `.env` na raiz do projeto com as credenciais:

```env
SAUCE_USER=standard_user
SAUCE_SENHA=secret_sauce
```

### Configuração do CI/CD

Para executar os testes no GitHub Actions, configure os **Secrets**:

1. Acesse: `Settings > Secrets and variables > Actions`
2. Adicione os seguintes secrets:
   - `SAUCE_USER`: `standard_user`
   - `SAUCE_SENHA`: `secret_sauce`
   - `GH_PAGES_TOKEN`: Personal Access Token com scope `repo` (opcional, para publicar relatórios)

> **Nota:** Se não configurar `GH_PAGES_TOKEN`, o workflow usará `GITHUB_TOKEN` (pode ter limitações de permissão).

---

## 🧪 Executando os Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes com geração de relatório Allure

```bash
npm run test:report
```

### Executar testes específicos

```bash
# Apenas testes de login
npx playwright test tests/LoginTest.spec.ts

# Apenas testes de compra
npx playwright test tests/CompraTest.spec.ts
```

### Executar em modo debug (Playwright Inspector)

```bash
npx playwright test --debug
```

### Executar com interface gráfica

```bash
npx playwright test --ui
```

---

## 📊 Relatórios Allure

### Gerar Relatório Localmente

1. **Execute os testes** (gera `allure-results`):

```bash
npm test
```

2. **Gere o relatório HTML**:

```bash
npm run allure:generate
```

3. **Abra o relatório no navegador**:

```bash
npm run allure:open
```

### Estrutura do Relatório Allure

O relatório inclui:

- **📊 Overview** - Dashboard com estatísticas gerais
- **🌳 Suites** - Testes organizados por suite (Login, Compras)
- **📈 Graphs** - Gráficos de status, severidade e duração
- **⏱️ Timeline** - Linha do tempo de execução
- **📈 Trend** - Histórico de execuções (após 2+ execuções no CI)
- **🏷️ Categories** - Categorização de falhas:
  - Timeout errors
  - Login failures
  - Infrastructure problems
  - Product defects
  - Test defects
- **📦 Packages** - Organização por módulos
- **🎬 Attachments** - Screenshots e vídeos de cada teste

### Relatório Publicado (CI/CD)

Após cada execução da pipeline, o relatório Allure é automaticamente publicado em:

```
https://seu-usuario.github.io/outsera_web/
```

> **Trend e Histórico:** O gráfico de Trend aparece a partir da **2ª execução** da pipeline, mostrando a evolução dos testes ao longo do tempo.

---

## 🔄 CI/CD Pipeline

### Workflow do GitHub Actions

O projeto usa GitHub Actions para executar testes automaticamente. O workflow (`playwright-gh-pages.yml`) é acionado em:

- ✅ **Push** para branches `main`, `master` ou `feature/**`
- ✅ **Pull Requests**

### Etapas da Pipeline

1. ✅ **Checkout** do código
2. ✅ **Setup Node.js** 18
3. ✅ **Instalação** de dependências (`npm ci` ou `npm install`)
4. ✅ **Instalação** dos navegadores Playwright
5. ✅ **Verificação** de credenciais (masked logs)
6. ✅ **Execução** dos testes Playwright
7. ✅ **Cópia** do `categories.json` para allure-results
8. ✅ **Download** do histórico anterior (para Trend)
9. ✅ **Geração** do relatório Allure HTML
10. ✅ **Publicação** no GitHub Pages (branch `gh-pages`)

### Visualizar Execuções

Acesse a aba **Actions** no GitHub para ver o status das execuções:

```
https://github.com/seu-usuario/outsera_web/actions
```

---

## 📁 Estrutura do Projeto

```
outsera_web/
├── .github/
│   └── workflows/
│       └── playwright-gh-pages.yml    # Workflow CI/CD
├── Data/
│   └── Users.ts                        # Dados de usuários (credenciais)
├── fixture/
│   └── test-fixture.ts                 # Fixtures customizadas (Page Objects)
├── src/
│   └── Page/
│       ├── homePage.ts                 # Page Object - Home/Login
│       ├── ProductsPage.ts             # Page Object - Produtos
│       ├── CarrinhoPage.ts             # Page Object - Carrinho
│       └── CheckoutPage.ts             # Page Object - Checkout
├── tests/
│   ├── LoginTest.spec.ts               # Testes de Login
│   └── CompraTest.spec.ts              # Testes de Compra
├── allure-results/                     # Resultados brutos do Allure (gerado)
├── allure-report/                      # Relatório HTML do Allure (gerado)
├── categories.json                     # Configuração de categorias do Allure
├── playwright.config.ts                # Configuração do Playwright
├── package.json                        # Dependências e scripts
├── TROUBLESHOOTING.md                  # Guia de troubleshooting
└── README.md                           # Este arquivo
```

---

## 🔍 Troubleshooting

Encontrou algum problema? Consulte o **[Guia de Troubleshooting](./TROUBLESHOOTING.md)** para soluções de problemas comuns:

- ❌ Erro 404 no relatório Allure
- ❌ Suites vazias no Allure
- ❌ Problemas com `npm ci`
- ❌ Erro 403 ao publicar gh-pages
- ❌ Credenciais ausentes no CI
- ⏱️ Timeout errors
- 📦 Problemas de dependências
- 🔄 Testes passam local mas falham no CI

**[📖 Ver Guia Completo de Troubleshooting](./TROUBLESHOOTING.md)**

---

## 🧪 Exemplos de Uso

### Executar um teste específico

```bash
npx playwright test tests/LoginTest.spec.ts -g "Login Sucesso"
```

### Executar testes em paralelo

```bash
npx playwright test --workers=4
```

### Executar apenas em Chromium

```bash
npx playwright test --project=chromium
```

### Gerar trace para debug

```bash
npx playwright test --trace on
```

---

## 📊 Categories (Categorização de Falhas)

O arquivo `categories.json` categoriza automaticamente as falhas em:

| Categoria | Descrição |
|-----------|-----------|
| **Timeout errors** | Erros de timeout (waitForURL, waitForSelector) |
| **Login failures** | Falhas relacionadas à autenticação |
| **Infrastructure problems** | Problemas de rede/conexão |
| **Product defects** | Defeitos no produto testado |
| **Test defects** | Defeitos nos próprios testes |
| **Ignored tests** | Testes ignorados (skipped) |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Commit

- `Add:` Nova funcionalidade
- `Fix:` Correção de bug
- `Update:` Atualização de código existente
- `Refactor:` Refatoração de código
- `Docs:` Atualização de documentação
- `Test:` Adição ou modificação de testes

---

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:report` | Executa testes e gera relatório Allure |
| `npm run allure:generate` | Gera relatório Allure a partir dos resultados |
| `npm run allure:open` | Abre o relatório Allure no navegador |

---

## 📄 Licença

Este projeto é de uso educacional/demonstrativo.

---

## 👤 Autor

Desenvolvido como parte do desafio técnico Outsera.

---

## 📚 Recursos Adicionais

- [Documentação do Playwright](https://playwright.dev/)
- [Documentação do Allure](https://docs.qameta.io/allure/)
- [Sauce Demo - App de Teste](https://www.saucedemo.com)
- [GitHub Actions - Docs](https://docs.github.com/actions)
- [Guia de Troubleshooting](./TROUBLESHOOTING.md)

---

**Última atualização:** 2025-11-03

---

## 🎯 Funcionalidades Implementadas

- ✅ Testes E2E completos (Login + Compras)
- ✅ Page Object Model (POM)
- ✅ Fixtures customizadas
- ✅ Relatórios Allure com screenshots e vídeos
- ✅ CI/CD com GitHub Actions
- ✅ Publicação automática de relatórios no GitHub Pages
- ✅ Histórico de execuções (Trend)
- ✅ Categorização automática de falhas
- ✅ Mensagens customizadas para troubleshooting
- ✅ Documentação completa de troubleshooting
- ✅ Suporte a múltiplos browsers (configurável)
- ✅ Retry automático no CI (2 tentativas)
- ✅ Validação de credenciais com logs masked

