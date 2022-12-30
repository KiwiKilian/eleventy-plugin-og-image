const path = require('path');

module.exports = {
  /**
   * @param { import('eleventy-plugin-og-image').EleventyConfig } eleventyConfig
   * @param { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } [pluginOptions]
   * */
  mergeOptions(eleventyConfig, pluginOptions) {
    return {
      inputFileGlob: '*.og.*',
      outputFileExtension: 'png',
      outputDir: path.join(eleventyConfig.dir.output, 'og-images/'),
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
