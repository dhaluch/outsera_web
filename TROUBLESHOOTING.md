# Troubleshooting Guide - Testes Automatizados

Este guia ajuda a diagnosticar e resolver problemas comuns nos testes automatizados do projeto.

---

## 📋 Índice

1. [Problemas na Pipeline (CI/CD)](#problemas-na-pipeline-cicd)
2. [Problemas com Credenciais](#problemas-com-credenciais)
3. [Problemas com Allure Report](#problemas-com-allure-report)
4. [Problemas de Timeout](#problemas-de-timeout)
5. [Problemas de Dependências](#problemas-de-dependências)
6. [Problemas Locais vs CI](#problemas-locais-vs-ci)

---

## 🔧 Problemas na Pipeline (CI/CD)

### Erro: `npm ci` falha com "packages not in sync"

**Sintoma:**
```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync
npm error Missing: allure-playwright@3.0.0 from lock file
```

**Causa:** O arquivo `package-lock.json` está desatualizado ou não foi commitado.

**Solução:**
```bash
# Execute localmente
npm install

# Commite o package-lock.json atualizado
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

---

### Erro: `Permission denied to github-actions[bot]` ao publicar gh-pages

**Sintoma:**
```
remote: Permission to username/repo.git denied to github-actions[bot]
fatal: unable to access 'https://github.com/username/repo.git/': The requested URL returned error: 403
```

**Causa:** O `GITHUB_TOKEN` padrão não tem permissão para push no branch `gh-pages`.

**Solução:**

1. **Crie um Personal Access Token (PAT):**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token (classic)"
   - Selecione o scope `repo`
   - Copie o token gerado

2. **Adicione como Secret no repositório:**
   - Vá em: `Settings > Secrets and variables > Actions`
   - Clique em "New repository secret"
   - Nome: `GH_PAGES_TOKEN`
   - Valor: Cole o token copiado

3. **O workflow já está configurado para usar esse token como fallback**

---

## 🔐 Problemas com Credenciais

### Erro: "Credenciais ausentes: verifique os secrets"

**Sintoma:**
```
Error: Credenciais ausentes: verifique os secrets/variáveis de ambiente (SAUCE_USER / SAUCE_SENHA) no CI.
```

**Causa:** Os secrets `SAUCE_USER` e/ou `SAUCE_SENHA` não estão configurados no GitHub.

**Solução:**

1. **Adicione os secrets no repositório:**
   - Vá em: `Settings > Secrets and variables > Actions`
   - Clique em "New repository secret"
   - Adicione:
     - Nome: `SAUCE_USER`, Valor: `standard_user` (ou seu usuário)
     - Nome: `SAUCE_SENHA`, Valor: `secret_sauce` (ou sua senha)

2. **Verifique os logs da pipeline:**
   ```
   Has SAUCE_USER? yes
   Has SAUCE_SENHA? yes
   ```
   Se aparecer "no", os secrets não foram configurados corretamente.

---

### Testes passam localmente mas falham no CI com erro de login

**Sintoma:** Testes funcionam no ambiente local, mas falham no CI com erro de autenticação.

**Causa:** Variáveis de ambiente não estão sendo carregadas ou os secrets estão incorretos.

**Diagnóstico:**
1. Verifique os logs do step "Check credentials presence" na pipeline
2. Verifique se o arquivo `.env` local tem as mesmas credenciais

**Solução:**
- Confirme que os secrets no GitHub estão corretos
- Se usar `.env` localmente, certifique-se de que os valores correspondem aos do CI

---

## 📊 Problemas com Allure Report

### Erro 404 ao abrir testes no Allure Report

**Sintoma:** Ao clicar em um teste no relatório Allure, aparece:
```
404 - Test result with uid "xxx" not found
```

**Causa:** Os arquivos de dados (`*-result.json`, `*-container.json`) não foram incluídos no relatório gerado.

**Solução:**

1. **Localmente:**
   ```bash
   # Limpe o diretório de relatórios
   rmdir /S /Q allure-report  # Windows
   rm -rf allure-report       # Linux/Mac
   
   # Gere o relatório novamente
   npm run allure:generate
   npm run allure:open
   ```

2. **No CI:** Verifique se o workflow contém:
   ```yaml
   - name: Generate Allure HTML report
     run: |
       rm -rf allure-report
       npx allure generate allure-results -o allure-report  # SEM --clean
   ```

**Importante:** Não use a flag `--clean` com `npx allure generate`, pois ela pode causar perda de arquivos de dados.

---

### Suites vazias no Allure ("There are no items")

**Sintoma:** As suites aparecem na lista, mas ao clicar mostram "There are no items".

**Causa:** Conflito entre `allure.suite()` manual e configuração do reporter.

**Solução:**
Use `allure.parentSuite()` em vez de `allure.suite()`:

```typescript
// ❌ Errado
test.beforeEach(async ({homePage}) => {
    allure.suite("Login");
    // ...
})

// ✅ Correto
test.beforeEach(async ({homePage}) => {
    allure.parentSuite("Login");
    // ...
})
```

---

### Categories não aparecem no relatório

**Sintoma:** A seção "Categories" está vazia no Allure, mesmo com testes falhados.

**Causa:** O arquivo `categories.json` não foi copiado para `allure-results` antes da geração.

**Solução:**

1. **Verifique se o arquivo existe:**
   ```bash
   # Deve existir na raiz do projeto
   type categories.json  # Windows
   cat categories.json   # Linux/Mac
   ```

2. **Copie manualmente e regenere:**
   ```bash
   copy categories.json allure-results\categories.json  # Windows
   cp categories.json allure-results/categories.json    # Linux/Mac
   
   npm run allure:generate
   ```

3. **No CI:** O workflow já está configurado para fazer isso automaticamente.

---

### Trend (histórico) não aparece

**Sintoma:** A seção "Trend" está vazia no relatório Allure.

**Causa:** O Trend só aparece a partir da **segunda execução** da pipeline, pois precisa de histórico para comparar.

**Solução:**
- Execute a pipeline pelo menos **2 vezes**
- A partir da segunda execução, o gráfico de Trend será exibido
- Isso é **comportamento normal** do Allure

**Como funciona:**
1. **1ª execução:** Gera o relatório e salva o `history` no branch `gh-pages`
2. **2ª execução:** Baixa o `history` anterior, compara com a execução atual e exibe o Trend

---

## ⏱️ Problemas de Timeout

### TimeoutError: page.waitForURL/waitForSelector timeout exceeded

**Sintoma:**
```
TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
waiting for navigation to "**/inventory.html" until "load"
```

**Causas comuns:**
1. Login falhou (credenciais incorretas)
2. Aplicação está lenta ou indisponível
3. Seletor mudou na aplicação

**Diagnóstico:**
1. Verifique os **screenshots** anexados no relatório Allure
2. Verifique os **vídeos** da execução
3. Revise os logs do teste

**Soluções:**

1. **Aumente o timeout (temporário):**
   ```typescript
   await page.waitForURL('**/inventory.html', { timeout: 10000 }); // 10 segundos
   ```

2. **Verifique credenciais:**
   - Confirme que `SAUCE_USER` e `SAUCE_SENHA` estão corretos
   - Teste o login manualmente em https://www.saucedemo.com

3. **Verifique o seletor:**
   ```typescript
   // Adicione log antes da espera
   console.log('Waiting for element...');
   await page.waitForSelector('.inventory_list', { timeout: 10000 });
   console.log('Element found!');
   ```

---

### Testes mais lentos no CI que localmente

**Sintoma:** Testes passam localmente em 30s, mas no CI levam 2-3 minutos ou dão timeout.

**Causas:**
- Máquinas do CI são mais lentas
- Rede do CI pode ser mais lenta
- Concorrência de workers

**Solução:**

1. **Ajuste a configuração de workers no CI:**
   ```typescript
   // playwright.config.ts
   workers: process.env.CI ? 1 : undefined, // Já configurado: 1 worker no CI
   ```

2. **Aumente timeouts globais para CI:**
   ```typescript
   // playwright.config.ts
   export default defineConfig({
     timeout: process.env.CI ? 60000 : 30000, // 60s no CI, 30s local
     // ...
   })
   ```

---

## 📦 Problemas de Dependências

### Erro: "allure command not found"

**Sintoma:**
```
bash: allure: command not found
```

**Causa:** O pacote `allure-commandline` não está instalado ou o `npx` não está encontrando o comando.

**Solução:**
```bash
# Reinstale as dependências
npm install

# Ou instale especificamente o allure-commandline
npm install --save-dev allure-commandline@^2.30.0

# Teste
npx allure --version
```

---

### Erro: "Cannot find module 'allure-playwright'"

**Sintoma:**
```
Error: Cannot find module 'allure-playwright'
```

**Causa:** O pacote `allure-playwright` não está instalado.

**Solução:**
```bash
npm install --save-dev allure-playwright@^3.0.0
npm install
```

---

### Versões incompatíveis de Playwright

**Sintoma:**
```
Error: playwright version mismatch
```

**Solução:**
```bash
# Atualize todas as dependências do Playwright
npm install @playwright/test@latest

# Reinstale os browsers
npx playwright install --with-deps
```

---

## 🔄 Problemas Locais vs CI

### Testes passam localmente mas falham no CI

**Causas comuns:**

1. **Variáveis de ambiente diferentes**
   - **Diagnóstico:** Compare `.env` local com secrets do GitHub
   - **Solução:** Sincronize as variáveis

2. **Dependências desatualizadas no CI**
   - **Diagnóstico:** Verifique se `package-lock.json` está commitado
   - **Solução:** `npm install` + commit do lockfile

3. **Resolução de tela diferente**
   - **Diagnóstico:** CI usa headless, pode ter viewport diferente
   - **Solução:** Configure viewport fixo no `playwright.config.ts`

4. **Timezone diferente**
   - **Diagnóstico:** Testes que dependem de data/hora podem falhar
   - **Solução:** Use timezone UTC ou configure no CI

---

## 🆘 Como Obter Mais Informações para Debug

### 1. Habilite logs detalhados

```typescript
// No teste problemático
test("Meu teste", async ({page}) => {
    // Habilite logs de console
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    // Seu teste aqui
});
```

### 2. Tire screenshots manuais em pontos específicos

```typescript
await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
console.log('Screenshot salvo para debug');
```

### 3. Use o modo debug do Playwright localmente

```bash
# Abre o Playwright Inspector
npx playwright test --debug

# Ou para um teste específico
npx playwright test tests/LoginTest.spec.ts --debug
```

### 4. Analise os artefatos do Allure

No relatório Allure, verifique:
- ✅ **Screenshots** - Estado visual quando o erro ocorreu
- ✅ **Videos** - Gravação completa da execução
- ✅ **Logs** - Console logs e mensagens de erro
- ✅ **Timeline** - Sequência temporal das ações

---

## 📞 Precisa de Ajuda?

Se o problema persistir após seguir este guia:

1. **Verifique os logs completos** da pipeline no GitHub Actions
2. **Analise o relatório Allure** publicado no gh-pages
3. **Compare** o comportamento local vs CI usando os videos/screenshots
4. **Revise** as mensagens customizadas nas assertions - elas indicam o que deveria ter acontecido

---

## 📚 Links Úteis

- [Documentação do Playwright](https://playwright.dev)
- [Documentação do Allure](https://docs.qameta.io/allure/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Sauce Demo (app de teste)](https://www.saucedemo.com)

---

**Última atualização:** 2025-11-03

