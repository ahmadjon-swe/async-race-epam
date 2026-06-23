module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.app.json',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    // RTK slices use Immer — direct state mutation is intentional
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['state', 'car'] },
    ],
    // defaultProps are deprecated in modern React; TS default params cover this
    'react/require-default-props': 'off',
  },
  ignorePatterns: ['dist/', 'vite.config.ts', 'eslint.config.js'],
};
