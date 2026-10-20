import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
    {ignores: ['build/**', 'node_modules/**', '.npm/**']},
    {
        ...js.configs.recommended,
        files: ['**/*.{js,jsx,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {...globals.browser, ...globals.node},
            parserOptions: {ecmaFeatures: {jsx: true}},
        },
    },
    {
        files: ['src/**/*.{js,jsx}'],
        plugins: {react, 'react-hooks': hooks, 'jsx-a11y': jsxA11y},
        settings: {react: {version: 'detect'}},
        rules: {
            ...react.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'no-unused-vars': ['error', {args: 'none', caughtErrors: 'none'}],
        },
    },
];
