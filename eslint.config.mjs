import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactNative from "eslint-plugin-react-native";
import pluginPrettier from "eslint-plugin-prettier";
import pluginJest from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      prettier: pluginPrettier,
      "@typescript-eslint": tsEslint,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-native": pluginReactNative,
      jest: pluginJest,

    },
    rules: {
      // General ESLint rules
      ...pluginJs.configs.recommended.rules,

      // TypeScript rules
      ...tsEslint.configs.recommended.rules,

      // React rules
      ...pluginReact.configs.flat.recommended.rules,

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Native rules
      "react-native/split-platform-components": "error",
      // "react-native/no-raw-text": "error",

      // Jest-specific rules (optional)
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",

      // Prettier integration
      "prettier/prettier": "error", // Ensures prettier issues are shown as ESLint errors
    },
  },
  {
    // This override applies the Jest environment to test files only
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    languageOptions: {
      globals: {
        ...globals.jest, // Enable Jest globals like `test`, `expect`, etc.
      },
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];
