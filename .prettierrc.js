import prettierConfig from '@kiwikilian/prettier-config' with { type: 'json' };

/** @type {import('prettier').Config} */
export default {
  ...prettierConfig,
  plugins: ['prettier-plugin-jsdoc', 'prettier-plugin-jinja-template'],
  overrides: [
    {
      files: ['**/*.njk'],
      options: {
        parser: 'jinja-template',
      },
    },
  ],
};
