import path from 'node:path';
import slugify from '@sindresorhus/slugify';
import { getHash } from './getHash.js';

/**
 * @param { import('eleventy-plugin-og-image').DirectoriesConfig } [directoriesConfig]
 * @param { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } [pluginOptions]
 *
 * @returns {
 *   Omit<Required<EleventyPluginOgImageOptions>, 'sharpOptions'> &
 *   Pick<EleventyPluginOgImageOptions, 'sharpOptions'>
 * }
 * */
export function mergeOptions({ directoriesConfig, pluginOptions } = {}) {
  return {
    inputFileGlob: '**/*.og.*',
    getOutputFileSlug: ({ svg, context }) =>
      ['watch', 'serve'].includes(context.eleventy.env.runMode)
        ? slugify(context.page.url) || 'index'
        : getHash({ input: svg, hashLength: 10 }),
    outputFileExtension: 'png',
    outputDir: path.join(directoriesConfig ? directoriesConfig.output : '', 'og-images/'),
    urlPath: '/og-images/',
    generateHTML: (outputUrl) => `<meta property="og:image" content="${outputUrl}" />`,
    ...pluginOptions,

    satoriOptions: {
      width: 1200,
      height: 630,
      fonts: [],
      ...(pluginOptions && pluginOptions.satoriOptions),
    },
  };
}
