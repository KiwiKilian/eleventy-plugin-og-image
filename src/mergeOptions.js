import path from 'node:path';

export const INPUT_FILE_GLOB = '**/*.og.*';

/**
 * @param {DirectoriesConfig} [directoriesConfig]
 * @param {EleventyPluginOgImageOptions} [pluginOptions]
 * @returns {EleventyPluginOgImageMergedOptions}
 */
export function mergeOptions({ directoriesConfig, pluginOptions }) {
  return {
    inputFileGlob: INPUT_FILE_GLOB,
    hashLength: 8,
    outputFileExtension: 'png',
    outputDir: path.join(directoriesConfig ? directoriesConfig.output : '', 'og-images'),
    previewDir: path.join(directoriesConfig ? directoriesConfig.output : '', 'og-images', 'preview'),
    urlPath: 'og-images',

    /** @this {OgImage} */
    getOutputFileSlug() {
      return this.hash();
    },

    /** @this {OgImage} */
    async generateHTML() {
      return `<meta property="og:image" content="${await this.outputUrl()}" />`;
    },

    ...pluginOptions,

    satoriOptions: {
      width: 1200,
      height: 630,
      fonts: [],
      ...(pluginOptions && pluginOptions.satoriOptions),
    },
  };
}
