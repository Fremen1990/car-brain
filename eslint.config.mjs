import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactNative from "eslint-plugin-react-native";
import pluginPrettier from "eslint-plugin-prettier";
import pluginJest from "eslint-plugin-jest";
import pluginImport from "eslint-plugin-import";

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
      import: pluginImport,
    },
    rules: {
      // General ESLint rules
      ...pluginJs.configs.recommended.rules,

      // TypeScript rules
      ...tsEslint.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // Enforces `import type` syntax
          disallowTypeAnnotations: false,
        },
      ],

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
      "prettier/prettier": "error",

      // Import order rules
      "import/order": [
        "error",
        {
          "groups": [
            "builtin", // Node "builtin" modules (like fs, path)
            "external", // "external" packages from npm (e.g., react, lodash)
            "internal", // Internal imports, like aliases for project-specific folders
            ["parent", "sibling"], // Parent & sibling imports
            "index", // Index files ("./")
            "object", // Imports using the object spread operator
            "type", // Import type definitions
          ],
          "newlines-between": "always", // Add new lines between groups
          "alphabetize": {
            "order": "asc", // Order imports alphabetically within each group
            "caseInsensitive": true // Ignore case while ordering
          },
          "distinctGroup": true, // Custom rule to separate default and named imports
        }
      ],

      // Import sorting and separation
      "import/newline-after-import": "error", // Ensures there is a newline after the last import
      "import/no-duplicates": "error", // Prevents duplicate imports
    },
  },
  {
    // This override applies the Jest environment to test files only
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    languageOptions: {
      globals: {
        ...globals.jest, // Enable Jest globals like `test`, `expect`, etc.
        __DEV__: 'readonly',
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
