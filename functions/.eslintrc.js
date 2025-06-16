// functions/.eslintrc.js
module.exports = {
  root: true, // impede herdar configs da raiz
  env: { es2020: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  ignorePatterns: ['lib/**'], // ignora JS compilado
  rules: {}
};
