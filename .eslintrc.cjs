require('@kiwikilian/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kiwikilian/eslint-config/profile/node'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    'import/extensions': [
      'error',
      {
        js: 'ignorePackages',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['./example/**', './example/.eleventy.js', './test/**'] },
    ],
  },

  overrides: [
    {
      files: './test/**',
      rules: {
        'import/no-unresolved': ['off'],
      },
    },
  ],
};
