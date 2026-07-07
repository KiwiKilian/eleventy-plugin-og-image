import path from 'node:path';
import { computeOptionsHash, prepareOptionsForHash } from './computeOptionsHash.js';
import { pageUrlSlug } from './pageUrlSlug.js';

/**
 * Merges the plugin options with defaults
 *
 * @param {DirectoriesConfig} [directoriesConfig]
 * @param {EleventyPluginOgImageOptions} [pluginOptions]
 * @returns {EleventyPluginOgImageMergedOptions}
 */
export function mergeOptions({ directoriesConfig, pluginOptions }) {
  const {
    outputDir,
    previewDir,
    urlPath,
    OgImage,
    satoriOptions,
    sharpOptions,
    slugStrategy = 'contentHash',
    outputFileSlug,
    manifest = true,
    ...options
  } = pluginOptions || {};

  const eleventyOutput = directoriesConfig ? directoriesConfig.output : '';
  const joinedOutputDir = path.join(eleventyOutput, outputDir || 'og-images');

  const mergedSatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [],
    ...satoriOptions,
  };

  const preparedOptionsForHash = prepareOptionsForHash(mergedSatoriOptions, sharpOptions);

  return {
    inputFileGlob: '**/*.og.*',
    hashLength: 8,
    outputFileExtension: 'png',
    outputDir: joinedOutputDir,
    previewMode: 'auto',
    previewDir: path.join(...(previewDir ? [eleventyOutput, previewDir] : [joinedOutputDir, 'preview'])),
    urlPath: urlPath || outputDir || 'og-images',
    slugStrategy,
    manifest,
    preparedOptionsForHash,
    optionsHash: computeOptionsHash(mergedSatoriOptions, sharpOptions, preparedOptionsForHash),

    /** @param {OgImage} ogImage */
    outputFileSlug:
      outputFileSlug ||
      (async (ogImage) => {
        if (ogImage.options.slugStrategy === 'pageUrl') {
          return pageUrlSlug(ogImage.data);
        }

        return ogImage.hash();
      }),

    /** @param {OgImage} ogImage */
    shortcodeOutput: async (ogImage) => `<meta property="og:image" content="${await ogImage.outputUrl()}" />`,

    ...options,

    satoriOptions: mergedSatoriOptions,
  };
}
