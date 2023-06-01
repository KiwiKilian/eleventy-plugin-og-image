const path = require('path');

module.exports = {
  /**
   * @param { Omit<import('eleventy-plugin-og-image').EleventyPluginOgImageOptions, 'satoriOptions' | 'sharpOptions'> } options
   * @param { string } fileSlug
   *
   * @returns {{ outputFilename: string, outputFilePath: string, outputUrl: string }}
   * */
  getOutputParameters({ options, fileSlug }) {
    const outputFilename = `${fileSlug}.${options.outputFileExtension}`;
    const outputFilePath = path.join(options.outputDir, outputFilename);
    const outputUrl = path.join(options.urlPath, outputFilename);

    return { outputFilename, outputFilePath, outputUrl };
  },
};
