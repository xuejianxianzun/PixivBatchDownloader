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
        "indent": [0, "tab"],
        "linebreak-style": ["error", "windows"],
        "quotes": [0, "single"],
        "semi": [2, "always"],
        "no-console": "off"
    },
    "globals": {
        "browser": true,
        "zip": true,
        "GIF": true,
        "Viewer": true
    }
};