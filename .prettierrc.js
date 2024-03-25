import prettierConfig from '@kiwikilian/prettier-config' with { type: 'json' };

export default {
  ...prettierConfig,

  plugins: ['prettier-plugin-jsdoc'],
};
