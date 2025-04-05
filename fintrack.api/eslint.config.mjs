// eslint.config.mjs
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        beforeAll: "readonly",
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "off"
    },
  },
]);
