// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                global: true,
                ...global.node,
                process: true,
                console: true
            }
        }
    },
    {
        rules: {
            "no-unused-vars": "error",
            "no-undef": "error",
            "prefer-const": "off",
            "no-console": "warn",
        }
    },
    {
        ignores: ["**/node_modules/", "**/dist/", "./eslint.config.mjs"],
    }
);