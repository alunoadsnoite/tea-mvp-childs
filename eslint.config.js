import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Config plugins do Expo rodam em Node/CommonJS, fora do escopo do app
    ignores: [
      "node_modules/",
      "android/",
      "ios/",
      ".expo/",
      "build/",
      "plugins/",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
