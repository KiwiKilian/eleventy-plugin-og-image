import path from 'node:path';

/**
 * Merges the plugin options with defaults
 *
 * @param {DirectoriesConfig} [directoriesConfig]
 * @param {EleventyPluginOgImageOptions} [pluginOptions]
 * @returns {EleventyPluginOgImageMergedOptions}
 */
export function mergeOptions({ directoriesConfig, pluginOptions }) {
  const { outputDir, previewDir, urlPath, satoriOptions, ...options } = pluginOptions || {};

  return {
    inputFileGlob: '**/*.og.*',
    hashLength: 8,
    outputFileExtension: 'png',
    outputDir: path.join(directoriesConfig ? directoriesConfig.output : '', outputDir || 'og-images'),
    previewDir: path.join(
      directoriesConfig ? directoriesConfig.output : '',
      ...(previewDir ? [previewDir] : ['og-images', 'preview']),
    ),
    urlPath: urlPath || outputDir || 'og-images',

    /** @this {OgImage} */
    getOutputFileSlug() {
      return this.hash();
    },

    /** @this {OgImage} */
    async generateHTML() {
      return `<meta property="og:image" content="${await this.outputUrl()}" />`;
    },

    ...options,

    satoriOptions: {
      width: 1200,
      height: 630,
      fonts: [],
      ...satoriOptions,
    },
  };
}
