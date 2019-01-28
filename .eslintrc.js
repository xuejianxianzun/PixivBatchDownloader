module.exports = {
    "env": {
        "browser": true,
        "commonjs": false,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8
    },
    "rules": {
        "indent": ["error", "tab"],
        "linebreak-style": ["error", "windows"],
        "quotes": ["error", "single"],
        "semi": [2, "always"],
        "no-console": "off"
    },
    "globals": {
        "browser": true,
    }
};