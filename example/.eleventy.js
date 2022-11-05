const fs = require('fs');
const twemoji = require('twemoji/dist/twemoji.npm');
const fetch = require('node-fetch');
const EleventyPluginOgImage = require('../.eleventy');

/** @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig */
module.exports = (eleventyConfig) => {
  /** @type { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } */
  const eleventyPluginOgImageOptions = {
    outputFileExtension: 'png',

    satoriOptions: {
      fonts: [
        {
          name: 'Inter',
          data: fs.readFileSync('../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'),
          weight: 700,
          style: 'normal',
        },
      ],
      loadAdditionalAsset: async (languageCode, segment) => {
        if (languageCode === 'emoji') {
          const emojiUrl = `https://twemoji.maxcdn.com/v/latest/svg/${twemoji.convert.toCodePoint(segment)}.svg`;
          const emojiSvg = await (await fetch(emojiUrl)).text();

          return `data:image/svg+xml;base64,${Buffer.from(emojiSvg).toString('base64')}`;
        }

        return segment;
      },
    },
  };

  eleventyConfig.addPlugin(EleventyPluginOgImage, eleventyPluginOgImageOptions);
};
