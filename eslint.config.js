import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default tseslint.config(
    { ignores: ["dist", "node_modules", "prototype", ".gemini", "coverage", "scripts"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],

            // ESM Enforcement - Koda Zenith is ESM-only
            "no-restricted-syntax": [
                "error",
                {
                    "selector": "CallExpression[callee.name='require']",
                    "message": "🏔️ Koda Zenith is ESM-only. Use 'import' instead of 'require()'"
                },
                {
                    "selector": "MemberExpression[object.name='module'][property.name='exports']",
                    "message": "🏔️ Koda Zenith is ESM-only. Use 'export' instead of 'module.exports'"
                },
                {
                    "selector": "Identifier[name='__dirname'], Identifier[name='__filename']",
                    "message": "🏔️ Koda Zenith is ESM-only. Use 'import.meta.url' instead of '__dirname/__filename'"
                }
            ]
        },
    },
);
