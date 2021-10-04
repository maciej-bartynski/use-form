module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint', "react"
    ],
    settings: {
        react: {
            version: "detect"
        }
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    extends: [
        'eslint:recommended',
        "plugin:react/recommended",
        'plugin:@typescript-eslint/recommended',
        "plugin:prettier/recommended",
        "prettier"
    ],
    rules: {
        "react/jsx-boolean-value": 1,
        "react/prop-types": 0,
        "@typescript-eslint/no-unused-vars": 2,
        "no-console": 2,
        // disable the rule for all files (will be enabled in overrides field)
        "@typescript-eslint/explicit-module-boundary-types": "off"
    },
    overrides: [
        {
            // enable the rule specifically for TypeScript files
            "files": ["*.ts", "*.tsx"],
            "rules": {
                "@typescript-eslint/explicit-module-boundary-types": ["error"]
            }
        }
    ]
};