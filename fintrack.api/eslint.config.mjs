import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: {
      globals: globals.browser,
      process: "readonly",
      beforeAll: "readonly",
      test: "readonly",
      expect: "readonly",
      describe: "readonly",
    }
  },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      ...configPrettier.rules,
      "prettier/prettier": "error",
    },
  },
]);