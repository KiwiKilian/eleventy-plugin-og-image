// eslint-disable-next-line node/no-unpublished-require
const { html } = require('./build/satori-html');
const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');
const fetch = require('node-fetch');
const sharp = require('sharp');
globalThis.fetch = fetch;

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 * @param { import('./index.d.ts').EleventyPluginOgImageOptions } options
 * */
module.exports = function eleventyPluginOgImage(eleventyConfig, options) {
  const { outputFileExtension, satoriOptions, sharpOptions } = {
    outputFileExtension: 'png',
    ...options,

    satoriOptions: {
      width: 1200,
      height: 630,
      ...options.satoriOptions,
    },
  };

  eleventyConfig.addTemplateFormats('og');

  eleventyConfig.addExtension('og', {
    outputFileExtension,
    outputFilePath: 'public',

    compile: async (inputContent) => {
      const svg = await satori(html(inputContent), satoriOptions);
      const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });
      const pngBuffer = resvg.render().asPng();

      let outputBuffer;
      if (outputFileExtension === 'png') {
        outputBuffer = pngBuffer;
      } else {
        outputBuffer = sharp(pngBuffer).toFormat(outputFileExtension, sharpOptions).toBuffer();
      }

      return async () => {
        return outputBuffer;
      };
    },
  });
};
