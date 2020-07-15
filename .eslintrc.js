module.exports = {
  env: {
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': [
      'error', 'ignorePackages', {
        ts: 'never',
      },
    ],
    //'@typescript-eslint/interface-name-prefix': ['error', {'prefixWithI':'always'}]
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
