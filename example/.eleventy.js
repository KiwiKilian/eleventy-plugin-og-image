import fs from 'node:fs';
import module from 'node:module';
import twemoji from 'twemoji';
import EleventyPluginOgImage from '../.eleventy.js';

const require = module.createRequire(import.meta.url);

/** @param {import('@11ty/eleventy/src/UserConfig').default} eleventyConfig */
export default async function (eleventyConfig) {
  eleventyConfig.addShortcode('testShortcode', () => 'Eleventy Plugin OG Image');

  /** @type {import('eleventy-plugin-og-image').EleventyPluginOgImageOptions} */
  const eleventyPluginOgImageOptions = {
    satoriOptions: {
      fonts: [
        {
          name: 'Inter',
          data: fs.readFileSync(require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff')),
          weight: 700,
          style: 'normal',
        },
      ],
      loadAdditionalAsset: async (languageCode, segment) => {
        if (languageCode === 'emoji') {
          const emojiUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${twemoji.convert.toCodePoint(
            segment,
          )}.svg`;
          const emojiSvg = await (await fetch(emojiUrl)).text();

          return `data:image/svg+xml;base64,${Buffer.from(emojiSvg).toString('base64')}`;
        }

        return segment;
      },
    },
  };

  eleventyConfig.addPlugin(EleventyPluginOgImage, eleventyPluginOgImageOptions);
}
