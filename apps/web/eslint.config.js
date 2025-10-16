import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      'next-env.d.ts',
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**'
    ]
  },
  ...nextJsConfig,
  {
    files: ['**/*.{ts,tsx}']
  }
];
