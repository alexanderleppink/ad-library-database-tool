module.exports = {
  extends: ['next', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['unicorn'],
  overrides: [
    // Configuration for TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort'],
      extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  ],
  rules: {
    // https://stackoverflow.com/a/74327009
    // Note: you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto'
      }
    ],
    'prefer-const': 'error',
    '@typescript-eslint/consistent-type-imports': 'error', // Ensure `import type` is used when it's necessary
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true
        }
      }
    ]
  }
};
