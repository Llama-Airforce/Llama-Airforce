import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import esLintPluginImport from "eslint-plugin-import";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginVue from "eslint-plugin-vue";

import parser from "vue-eslint-parser";

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const autoImportConfig = JSON.parse(
  readFileSync(resolve(__dirname, ".eslintrc-auto-import.json"), "utf8")
);

export default [
  {
    ignores: ["src/Apps/CurveMonitor/phil/**/*"],
  },
  eslint.configs.recommended,
  esLintPluginImport.flatConfigs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...eslintPluginVue.configs["flat/recommended"],
  eslintPluginPromise.configs["flat/recommended"],
  {
    languageOptions: {
      parser,
      sourceType: "module",

      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: [".vue"],
      },

      globals: {
        ...autoImportConfig.globals,
      },
    },

    rules: {
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
          offsetTernaryExpressions: true,
          ignoredNodes: ["CallExpression"],
        },
      ],

      "arrow-body-style": ["error", "as-needed"],
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

      "import/no-unresolved": "off",

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
      "@typescript-eslint/no-import-type-side-effects": "error",

      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],

      "vue/block-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],
      "vue/no-template-shadow": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/prefer-true-attribute-shorthand": ["error", "always"],
      "vue/v-bind-style": [
        "error",
        "shorthand",
        {
          sameNameShorthand: "always",
        },
      ],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "never",
          },
        },
      ],
      "vue/attributes-order": [
        "error",
        {
          order: [
            "DEFINITION",
            "LIST_RENDERING",
            "CONDITIONALS",
            "RENDER_MODIFIERS",
            "GLOBAL",
            ["UNIQUE", "SLOT"],
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "ATTR_SHORTHAND_BOOL",
            "ATTR_STATIC",
            "ATTR_DYNAMIC",
            "EVENTS",
            "CONTENT",
          ],
          alphabetical: false,
        },
      ],
    },
  },
];
