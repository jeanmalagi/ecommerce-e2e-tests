export default {
  default: {
    paths: ['tests/features/**/*.feature'],
    import: [
      'tests/steps/**/*.mjs',
      'tests/support/**/*.mjs'
    ]
  }
};