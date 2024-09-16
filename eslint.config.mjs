import typescriptEslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['src/**/*.{ts,js,mjs}'],
    ignores: ['dist', 'node_modules']
  },
  ...typescriptEslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,

      // TODO: to improve because the basic rules cause
      // thousands of errors, for this reason, they have been marked as WARN
      'prettier/prettier': 'error',

      'prefer-const': 'warn',
      'prefer-rest-params': 'warn',
      'no-var': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn'
    }
  }
];
