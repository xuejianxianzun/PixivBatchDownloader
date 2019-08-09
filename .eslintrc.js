module.exports = {
  extends: ['eslint:recommended', 'standard'],
  rules: { 'no-console': 'off', 'no-useless-catch': 'off' },
  globals: {
    console: true,
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
