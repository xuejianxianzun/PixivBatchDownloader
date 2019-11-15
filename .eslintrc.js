module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    browser: true
  },
  extends: ['plugin:@typescript-eslint/eslint-recommended', 'prettier/@typescript-eslint', 'prettier'],
  rules: {
    'no-console': 'off',
    'no-useless-catch': 'off'
  },
  globals: {
    fetch: true,
    Blob: true,
    Image: true,
    XMLHttpRequest: true,
    chrome: true,
    zip: true,
    GIF: true,
    Whammy: true,
    Viewer: true,
    xzLang: true
  }
}
