module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'fsd-arch-validator'],
  rules: {
    'max-len': [
      'error',
      {
        ignoreComments: true,
        code: 100,
        ignoreStrings: true,
      },
    ],
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'warn',
    'import/extensions': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'assignment-to-function-param': 'off',
    'react/no-array-index-key': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'warn',
    'react/function-component-definition': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/self-closing-comp': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'fsd-arch-validator/relative-imports-within-module': 2,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    DeepPartial: true,
    ValueOf: true,
    OptionalRecord: true,
    JSX: true,
    Id: true,
  },
  overrides: [
    {
      files: ['src/**/*Slice.ts'],
      rules: {
        'no-param-reassign': ['error', { props: false }],
      },
    },
    {
      files: ['**/src/**/*.{test,stories}.{ts,tsx}'],
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: ['src/shared/**/*.{ts,tsx}', 'src/**/*.stories.{ts,tsx}'],
      rules: {
        'react/jsx-props-no-spreading': 'off',
      },
    },
    {
      files: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'config/**/*.{ts,tsx,js}',
        'src/shared/lib/tests/**/*.{ts,tsx}',
        'src/shared/config/**/*.{ts,tsx}',
        'vite.config.ts',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};

