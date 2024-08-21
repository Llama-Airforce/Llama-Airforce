import typescriptEslint from "@typescript-eslint/eslint-plugin";

import promise from "eslint-plugin-promise";
import globals from "globals";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["src/Apps/CurveMonitor/phil/**/*"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:vue/vue3-recommended",
    "plugin:promise/recommended",
    "./.eslintrc-auto-import.json"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      promise,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: parser,
      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "tsconfig.json",
        extraFileExtensions: [".vue"],
        createDefaultProgram: true,
      },
    },

    rules: {
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
          offsetTernaryExpressions: true,
        },
      ],

      "multiline-comment-style": ["error", "starred-block"],
      "no-tabs": "error",
      "max-lines": ["error", 1000],

      "max-lines-per-function": [
        "error",
        {
          max: 80,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      "max-params": ["error", 7],

      "newline-per-chained-call": [
        "error",
        {
          ignoreChainWithDepth: 3,
        },
      ],

      "prefer-const": "error",

      complexity: [
        "error",
        {
          max: 20,
        },
      ],

      "new-parens": "error",
      "no-bitwise": "error",
      "no-caller": "error",
      "no-eval": "error",
      "no-multiple-empty-lines": "error",
      "no-var": "error",
      "no-extra-parens": "off",
      "no-await-in-loop": "error",
      "no-setter-return": "error",
      "no-unneeded-ternary": "error",
      "no-useless-constructor": "off",
      "no-useless-escape": "off",
      "array-callback-return": "error",
      "default-case": "off",
      eqeqeq: "error",
      radix: "error",
      semi: "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-extra-parens": ["off"],
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: {
            max: 2,
          },

          multiline: {
            max: 2,
          },
        },
      ],
      "vue/block-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/no-setup-props-destructure": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
    },
  },
  {
    files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
