module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      rules: {}
    }
  ]
};
