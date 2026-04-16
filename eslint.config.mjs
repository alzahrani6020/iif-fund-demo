import js from '@eslint/js';
import globals from 'globals';

const relaxedUnused = [
  'error',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrors: 'none',
  },
];

/** Flat config لـ ESLint 9+ — يتجاهل الحزم الكبيرة والملفات المُولَّدة */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/package-lock.json',
      '**/dist/**',
      '**/build/**',
      'financial-consulting/iif-fund-demo/js/iif-index-app-bundle.js',
      'financial-consulting/iif-fund-demo/i18n-service-packs*.js',
      'financial-consulting/government-search/government-data.js',
      '**/*.min.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['scripts/**/*.{js,mjs,cjs}', 'netlify/**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': relaxedUnused,
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['scripts/e2e-*-playwright.mjs', 'scripts/e2e-public-viewports.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'no-unused-vars': relaxedUnused,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-undef': 'off',
    },
  },
  {
    files: ['financial-consulting/iif-fund-demo/api/**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': relaxedUnused,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-control-regex': 'off',
      'no-useless-escape': 'off',
    },
  },
];
