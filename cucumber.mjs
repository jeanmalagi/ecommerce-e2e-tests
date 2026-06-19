export default {
  default: {
    paths: ['tests/features/**/*.feature'],
    import: [
      'tests/steps/**/*.mjs',
      'support/**/*.mjs'
    ],
    format: ['allure-cucumberjs/reporter']
  }
};