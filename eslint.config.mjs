import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginVue from "eslint-plugin-vue";

import parser from "vue-eslint-parser";

import fs from "fs";
import path from "path";

const autoImportConfig = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), ".eslintrc-auto-import.json"),
    "utf8"
  )
);

export default [
  {
    ignores: ["src/Apps/CurveMonitor/phil/**/*"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...eslintPluginVue.configs["flat/recommended"],
  eslintPluginPromise.configs["flat/recommended"],
  {
    languageOptions: {
      parser: parser,
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "tsconfig.json",
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
];
