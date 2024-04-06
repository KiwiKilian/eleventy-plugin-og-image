import path from 'node:path';

export class Util {
  /**
   * @param {object} unordered
   * @returns {object}
   */
  static sortObject(unordered) {
    const keys = Object.keys(unordered).sort();

    return keys.reduce((object, key) => {
      object[key] = typeof unordered[key] === 'object' ? Util.sortObject(unordered[key]) : unordered[key];

      return object;
    }, {});
  }

  /**
   * @param {DirectoriesConfig} [directoriesConfig]
   * @param {EleventyPluginOgImageOptions} [pluginOptions]
   * @returns {EleventyPluginOgImageMergedOptions}
   */
  static mergeOptions({ directoriesConfig, pluginOptions: { outputDir, previewDir, urlPath, ...pluginOptions } = {} }) {
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

      ...pluginOptions,

      satoriOptions: {
        width: 1200,
        height: 630,
        fonts: [],
        ...(pluginOptions && pluginOptions.satoriOptions),
      },
    };
  }
}
