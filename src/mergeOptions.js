const path = require('path');

module.exports = {
  /**
   * @param { import('eleventy-plugin-og-image').DirectoriesConfig } [directoriesConfig]
   * @param { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } [pluginOptions]
   * */
  mergeOptions(directoriesConfig, pluginOptions) {
    return {
      inputFileGlob: '*.og.*',
      outputFileExtension: 'png',
      outputDir: path.join(directoriesConfig ? directoriesConfig.output : '', 'og-images/'),
      urlPath: '/og-images/',
      hashLength: 10,
      generateHTML: (outputUrl) => `<meta property="og:image" content="${outputUrl}" />`,
      ...pluginOptions,

      satoriOptions: {
        width: 1200,
        height: 630,
        fonts: [],
        ...(pluginOptions && pluginOptions.satoriOptions),
      },
    };
  },
};
