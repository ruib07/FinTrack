import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        beforeAll: "readonly",
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
      },
    },
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
    extends: [
      "eslint:recommended",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/recommended",
      prettierConfig,
    ],
  },
]);
