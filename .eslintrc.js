module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier/@typescript-eslint',
    'prettier'
  ],
  rules: {
    'no-console': 'off',
    'no-useless-catch': 'off'
  }
}
