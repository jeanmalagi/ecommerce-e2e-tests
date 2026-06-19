const shared = {
  import: [
    'tests/steps/**/*.mjs',
    'support/**/*.mjs'
  ],
  format: ['allure-cucumberjs/reporter'],
};

const defaultProfile = {
  ...shared,
  paths: ['tests/features/**/*.feature'],
  formatOptions: {
    resultsDir: 'allure-results'
  }
};

export const login = {
  ...shared,
  paths: ['tests/features/login.feature'],
  formatOptions: {
    resultsDir: 'allure-results/login'
  }
};

export const products = {
  ...shared,
  paths: ['tests/features/products.feature'],
  formatOptions: {
    resultsDir: 'allure-results/products'
  }
};

export const cart = {
  ...shared,
  paths: ['tests/features/cart.feature'],
  formatOptions: {
    resultsDir: 'allure-results/cart'
  }
};

export const checkout = {
  ...shared,
  paths: ['tests/features/checkout.feature'],
  formatOptions: {
    resultsDir: 'allure-results/checkout'
  }
};

export const adminAccess = {
  ...shared,
  paths: ['tests/features/admin-access.feature'],
  formatOptions: {
    resultsDir: 'allure-results/admin-access'
  }
};

export default defaultProfile;