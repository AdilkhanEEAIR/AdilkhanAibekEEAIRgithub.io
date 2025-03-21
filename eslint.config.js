/** @type {import('eslint').Linter.Config} */
module.exports = [
    {
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          node: true,
        },
      },
      rules: {
        'no-console': 'off',
        'semi': ['error', 'always'], 
        'quotes': ['error', 'single'], 
        'no-unused-vars': ['warn'],
        'eqeqeq': ['error', 'always'],
      },
    },
  ];
  