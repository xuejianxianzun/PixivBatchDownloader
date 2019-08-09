module.exports = {
  extends: ['eslint:recommended', 'standard'],
  plugins: ['standard', 'import', 'node', 'promise'],
  rules: {
    'no-console': 'off',
    'no-useless-catch': 'off',
    'no-unused-vars': 'off'
  },
  globals: {
    fetch: true,
    Blob: true,
    Image: true,
    XMLHttpRequest: true,
    FileReader: true,
    browser: true,
    chrome: true,
    zip: true,
    GIF: true,
    Whammy: true,
    Viewer: true,
    xzLang: true
  }
}
