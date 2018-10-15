module.exports = {
  "root": true,
    "extends": [
      "eslint:recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
    ],
    "env": {
      "node": true
    },
    "settings": {
      "react": {
        "version": "16.0"
      },
      "import/resolver": {
        "node": {
          "extensions": [
            ".js"
          ]
        }
      }
    },
    "parser": "babel-eslint",
    "parserOptions": {
      "ecmaVersion": 2017,
      "ecmaFeatures": {
        "experimentalObjectRestSpread": true,
      },
      "sourceType": "module"
    },
    "rules": {
      "eol-last": [
        "error"
      ],
      "arrow-parens": [
        "warn"
      ],
      "brace-style": [
        "error",
        "1tbs"
      ],
      "no-console": [
          "off"
      ],
      "no-fallthrough": [
        "error"
      ],
      "no-var": [
        "error"
      ],
      "no-trailing-spaces": [
        "error"
      ],
      "semi": [
        "error",
        "always"
      ],
    }
};