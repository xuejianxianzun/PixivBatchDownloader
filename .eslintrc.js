module.exports = {
  extends: ['eslint:recommended', 'standard'],
  plugins: ['standard', 'import', 'node', 'promise'],
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
