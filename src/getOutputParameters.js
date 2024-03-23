const path = require('path');
const url = require('url');

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

    const fileUrl = new url.URL('file://');
    fileUrl.pathname = path.join(options.urlPath, outputFilename);
    const outputUrl = fileUrl.pathname;

    return { outputFilename, outputFilePath, outputUrl };
  },
};
