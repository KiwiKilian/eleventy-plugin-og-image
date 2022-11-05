const path = require('path');
const { createHash } = require('crypto');

module.exports = {
  /**
   * @param { string } svg
   * @param { Omit<import('eleventy-plugin-og-image').EleventyPluginOgImageOptions, 'satoriOptions' | 'sharpOptions'> } options
   * */
  getOutputParameters(svg, options) {
    const hash = createHash('sha256').update(svg).digest('base64url').substring(0, options.hashLength);

    const outputFilename = `${hash}.${options.outputFileExtension}`;
    const outputFilePath = path.join(options.outputDir, outputFilename);
    const outputUrl = path.join(options.urlPath, outputFilename);

    return { outputFilename, outputFilePath, outputUrl };
  },
};
