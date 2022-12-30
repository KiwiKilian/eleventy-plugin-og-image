const fs = require('fs');
const fetch = require('node-fetch');
const sharp = require('sharp');
const { TemplatePath } = require('@11ty/eleventy-utils');
const { mergeOptions } = require('./src/mergeOptions');
const { getOutputParameters } = require('./src/getOutputParameters');
const { renderOgImage } = require('./src/renderOgImage');

globalThis.fetch = fetch;

/**
 * @param { Parameters<getOutputParameters>[0] } eleventyConfig
 * @param { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } pluginOptions
 * */
module.exports = function eleventyPluginOgImage(eleventyConfig, pluginOptions) {
  const { satoriOptions, sharpOptions, ...options } = mergeOptions(eleventyConfig, pluginOptions);

  eleventyConfig.ignores.add(options.inputFileGlob);

  eleventyConfig.addAsyncShortcode('ogImage', async (inputPath, data) => {
    if (!fs.existsSync(TemplatePath.normalizeOperatingSystemFilePath(inputPath))) {
      throw new Error(`Could not find file for the \`ogImage\` shortcode, looking for: ${inputPath}`);
    }

    const { svg, pngBuffer } = await renderOgImage(inputPath, data, satoriOptions);

    const image = await sharp(pngBuffer).toFormat(options.outputFileExtension, sharpOptions);

    const { outputFilePath, outputUrl } = getOutputParameters(svg, options);

    if (!fs.existsSync(options.outputDir)) {
      fs.mkdirSync(options.outputDir, { recursive: true });
    }

    await image.toFile(outputFilePath);

    eleventyConfig.logger.log(`Writing OG Image ${outputFilePath} from ${inputPath}`);

    return options.generateHTML(outputUrl);
  });
};
