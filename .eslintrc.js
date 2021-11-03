module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {},
};
