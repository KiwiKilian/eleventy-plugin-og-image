import path from 'node:path';

/**
 * Merges the plugin options with defaults
 *
 * @param {DirectoriesConfig} [directoriesConfig]
 * @param {EleventyPluginOgImageOptions} [pluginOptions]
 * @returns {EleventyPluginOgImageMergedOptions}
 */
export function mergeOptions({ directoriesConfig, pluginOptions }) {
  const { outputDir, previewDir, urlPath, OgImage, satoriOptions, ...options } = pluginOptions || {};

  const eleventyOutput = directoriesConfig ? directoriesConfig.output : '';
  const joinedOutputDir = path.join(eleventyOutput, outputDir || 'og-images');

  return {
    inputFileGlob: '**/*.og.*',
    hashLength: 8,
    outputFileExtension: 'png',
    outputDir: joinedOutputDir,
    previewMode: 'auto',
    previewDir: path.join(...(previewDir ? [eleventyOutput, previewDir] : [joinedOutputDir, 'preview'])),
    urlPath: urlPath || outputDir || 'og-images',

    /** @param {OgImage} ogImage */
    outputFileSlug: (ogImage) => ogImage.hash(),

    /** @param {OgImage} ogImage */
    shortcodeOutput: async (ogImage) => `<meta property="og:image" content="${await ogImage.outputUrl()}" />`,

    ...options,

    satoriOptions: {
      width: 1200,
      height: 630,
      fonts: [],
      ...satoriOptions,
    },
  };
}
