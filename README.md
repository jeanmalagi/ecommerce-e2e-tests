# Ecommerce E2E Tests

Projeto de testes end-to-end com Cucumber + Playwright para o sistema de ecommerce.

## Objetivo

Validar os principais fluxos da aplicacao de ecommerce:

- login
- produtos
- carrinho
- checkout
- acesso administrativo

Tambem gera evidencias automaticas:

- relatorios Allure por suite
- videos por cenario (com nome do cenario e status)

## Stack

- Node.js
- Cucumber (`@cucumber/cucumber`)
- Playwright
- Allure (`allure-cucumberjs` + `allure-commandline`)
- Jenkins (pipeline declarativa em Windows)

## Estrutura do Projeto

```text
support/
  hooks.mjs                # setup/teardown global + gravacao de video
  world.js

tests/
  features/
    login.feature
    products.feature
    cart.feature
    checkout.feature
    admin-access.feature
  steps/
    login.steps.mjs
    products.steps.mjs
    cart.steps.mjs
    checkout.steps.mjs
    admin-access.steps.mjs

cucumber.mjs               # configuracao de perfis e formatters
Jenkinsfile                # pipeline CI
```

## Pre-requisitos

- Node.js 18+
- npm
- Aplicacao alvo (frontend/backend) rodando e acessivel

## Instalacao

```bash
npm ci
npx playwright install
```

## Como Rodar os Testes

### Suite completa

```bash
npm run test:e2e
```

### Apenas login

```bash
npm run test:auth
```

### Executar via Cucumber profile especifico

```bash
npx cucumber-js --config cucumber.mjs --profile login
npx cucumber-js --config cucumber.mjs --profile products
npx cucumber-js --config cucumber.mjs --profile cart
npx cucumber-js --config cucumber.mjs --profile checkout
npx cucumber-js --config cucumber.mjs --profile adminAccess
```

## Relatorios Allure

### Resultado bruto

Arquivos brutos do Allure ficam em:

- `allure-results/<suite>`

### Gerar relatorio local (exemplo)

```bash
npx allure generate allure-results/login -o allure-report/login --clean --single-file
```

### Abrir relatorio local

Abra o arquivo:

- `allure-report/<suite>/index.html`

Observacao:

- o pipeline usa `--single-file` para evitar erro de `Failed to fetch` ao abrir o HTML localmente

## Videos dos Cenarios

Os videos sao gravados automaticamente no hook global.

Pasta de saida:

- `test-results/videos`

Padrao de nome:

- `<nome_do_cenario_slug>__<status>__<timestamp>.webm`

Exemplo:

- `cliente_remove_produto_do_carrinho__failed__1750361234567.webm`

## Pipeline Jenkins (resumo)

Fluxo principal:

1. Checkout
2. Install Dependencies (`npm ci`)
3. Install Playwright Browsers (`npx playwright install`)
4. Clean artifacts antigos (`allure-results`, `allure-report`, `test-results/videos`)
5. Executa suites em paralelo (`login`, `products`, `cart`, `checkout`, `admin-access`)
6. Gera relatorios Allure por suite
7. Compacta cada relatorio em zip
8. Publica artifacts

Artifacts publicados:

- `allure-results/**`
- `allure-report/**`
- `test-results/videos/**`

## Troubleshooting

### 1) Pipeline quebra no Windows com `Invalid switch`

Use caminhos com `/` dentro de blocos `bat` no Jenkinsfile.

### 2) Relatorio abre com `Failed to fetch`

Gere com `--single-file`.

### 3) Pipeline em `UNSTABLE`

Significa que pelo menos uma suite falhou (ex.: assertions do cenario), mas a pipeline seguiu para gerar evidencias.

### 4) Cenario instavel por estado residual (ex.: carrinho)

Garanta limpeza de estado no `Given` ou no hook de preparacao.

## Scripts Disponiveis

- `npm run test:e2e`: roda todas as features
- `npm run test:auth`: roda profile de login
- `npm run test:allure`: alias para execucao com configuracao atual do Cucumber
- `npm run allure:serve`: sobe servidor local do Allure sobre `./allure-results`

## Observacoes Finais

- O projeto esta configurado para uso local e CI em Jenkins Windows.
- A geracao de evidencias (Allure + videos) e feita mesmo quando ha falha de teste, para facilitar analise.
