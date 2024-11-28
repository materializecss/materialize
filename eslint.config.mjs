import typescriptEslint from 'typescript-eslint';

export default [
  {
    files: ['src/**/*.{ts,js,mjs}'],
    ignores: ['dist', 'node_modules']
  },
  ...typescriptEslint.configs.recommended,
  {
    rules: {
      'prefer-const': 'error',
      'prefer-rest-params': 'warn',
      'no-var': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error'
    }
  }
];
