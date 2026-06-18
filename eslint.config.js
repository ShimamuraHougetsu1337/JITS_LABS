const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.es2021
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      "eqeqeq": "error"
    }
  }
];
