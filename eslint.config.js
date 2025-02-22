// filepath: /F:/MyApis/eslint.config.js
import globals from "globals";
import js from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      // Add your custom rules here
    },
  },
  js.configs.recommended,
];