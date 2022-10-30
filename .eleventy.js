const fs = require('fs');
const path = require('path');
const { TemplatePath } = require('@11ty/eleventy-utils');
// eslint-disable-next-line node/no-unpublished-require
const { html: htmlToSatori } = require('./build/satori-html');
const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');
const fetch = require('node-fetch');
const sharp = require('sharp');
const { File } = require('@11ty/eleventy/src/Plugins/RenderPlugin');
globalThis.fetch = fetch;

/**
 * @param { import('@11ty/eleventy/src/UserConfig')
 *   & { dir: { input: string, includes: string, data: string, output: string }}
 * } eleventyConfig
 * @param { import('./index.d.ts').EleventyPluginOgImageOptions } options
 * */
module.exports = function eleventyPluginOgImage(eleventyConfig, options) {
  const { inputFileGlob, outputFileExtension, satoriOptions, sharpOptions } = {
    inputFileGlob: '*.og.*',
    outputFileExtension: 'png',
    ...options,

    satoriOptions: {
      width: 1200,
      height: 630,
      ...options.satoriOptions,
    },
  };

  eleventyConfig.ignores.add(inputFileGlob);

  eleventyConfig.addAsyncShortcode('ogImage', async function (inputPath, data) {
    if (!fs.existsSync(TemplatePath.normalizeOperatingSystemFilePath(inputPath))) {
      throw new Error(`Could not find file for the \`ogImage\` shortcode, looking for: ${inputPath}`);
    }

    const outputFilename = `${path.parse(inputPath).name.split('.')[0]}.${outputFileExtension}`;
    const outputPath = eleventyConfig.dir.output + this.page.url;
    const outputFilePath = path.join(outputPath, outputFilename);
    const outputUrl = path.join(this.page.url, outputFilename);

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const html = await (await File(inputPath))(data);
    const svg = await satori(htmlToSatori(html), satoriOptions);
    const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });
    const pngBuffer = resvg.render().asPng();

    await sharp(pngBuffer).toFormat(outputFileExtension, sharpOptions).toFile(outputFilePath);

    eleventyConfig.logger.log(`Writing OG Image ${outputFilePath} from ${inputPath}`);

    return `<meta property="og:image" content="${outputUrl}" />`;
  });
};
