const fs = require('fs');
const fetch = require('node-fetch');
const sharp = require('sharp');
const { TemplatePath } = require('@11ty/eleventy-utils');
const slugify = require('@sindresorhus/slugify');
const { mergeOptions } = require('./src/mergeOptions');
const { getOutputParameters } = require('./src/getOutputParameters');
const { renderOgImage } = require('./src/renderOgImage');
const { getHash } = require('./src/getHash');

globalThis.fetch = fetch;

/**
 * @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig
 * @param { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } pluginOptions
 * */
module.exports = (eleventyConfig, pluginOptions) => {
  let directoriesConfig;
  eleventyConfig.on('eleventy.directories', (dir) => {
    directoriesConfig = dir;
  });

  /**
   * @type { import('@11ty/eleventy/src/TemplateConfig') }
   */
  let templateConfig;
  eleventyConfig.on('eleventy.config', (config) => {
    templateConfig = config;
  });

  let logged = false;
  let previewFilenames = false;
  eleventyConfig.on('eleventy.before', ({ runMode }) => {
    if (runMode === 'serve' || runMode === 'watch') {
      previewFilenames = true;

      if (!logged) {
        console.log(`[eleventy-plugin-og-image] OG images use stable filenames for development`);
        logged = true;
      }
    }

    const options = mergeOptions({ directoriesConfig, pluginOptions });
    fs.rmSync(options.outputDir, { recursive: true, force: true });
  });

  eleventyConfig.ignores.add(mergeOptions({ directoriesConfig: undefined, pluginOptions }).inputFileGlob);

  eleventyConfig.addAsyncShortcode(
    'ogImage',
    /**
     *
     * @param { string } inputPath
     * @param { Record<string, any> } [data]
     *
     * @returns {Promise<string>}
     */
    async function ogImage(inputPath, data) {
      const { satoriOptions, sharpOptions, ...options } = mergeOptions({ directoriesConfig, pluginOptions });

      if (!fs.existsSync(TemplatePath.normalizeOperatingSystemFilePath(inputPath))) {
        throw new Error(`Could not find file for the \`ogImage\` shortcode, looking for: ${inputPath}`);
      }

      const { svg, pngBuffer } = await renderOgImage({ inputPath, data, satoriOptions, templateConfig });

      const image = await sharp(pngBuffer).toFormat(options.outputFileExtension, sharpOptions);

      const { outputFilePath, outputUrl } = getOutputParameters({
        options,
        fileSlug: previewFilenames
          ? slugify(this.page.url) || 'index'
          : getHash({ input: svg, hashLength: options.hashLength }),
      });

      if (!fs.existsSync(options.outputDir)) {
        fs.mkdirSync(options.outputDir, { recursive: true });
      }

      await image.toFile(outputFilePath);

      eleventyConfig.logger.log(`Writing OG Image ${outputFilePath} from ${inputPath}`);

      return options.generateHTML(outputUrl);
    },
  );
};
