module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:vue/vue3-recommended",
    "plugin:promise/recommended",
    "./.eslintrc-auto-import.json",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "tsconfig.json",
    sourceType: "module",
    extraFileExtensions: [".vue"],
    createDefaultProgram: true,
    ecmaVersion: 2020,
  },
  plugins: ["@typescript-eslint", "promise"],
  rules: {
    indent: ["error", 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
    "multiline-comment-style": ["error", "starred-block"],
    "no-tabs": "error",
    //"max-len": ["error", { "code": 120 }],
    "max-lines": ["error", 1000],
    "max-lines-per-function": [
      "error",
      { max: 80, skipBlankLines: true, skipComments: true },
    ],
    "max-params": ["error", 7],
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 3 }],
    "prefer-const": "error",
    complexity: ["error", { max: 20 }],

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
    "array-callback-return": "error",
    "default-case": "error",
    eqeqeq: "error",
    radix: "error",

    semi: "off",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-extra-semi": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-extra-parens": ["off"],
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-indexed-object-style": "off",
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

    "vue/singleline-html-element-content-newline": "off",
    "vue/html-self-closing": "off",
    "vue/no-setup-props-destructure": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: ["src/Apps/CurveMonitor/phil/**"],
};
