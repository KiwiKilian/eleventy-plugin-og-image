import fs from 'fs';
import sharp from 'sharp';
import { TemplatePath } from '@11ty/eleventy-utils';
import { mergeOptions } from './src/mergeOptions.js';
import { getOutputParameters } from './src/getOutputParameters.js';
import { renderOgImage } from './src/renderOgImage.js';

/**
 * @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig
 * @param { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } pluginOptions
 * */
const config = (eleventyConfig, pluginOptions) => {
  let directoriesConfig;
  eleventyConfig.on('eleventy.directories', (dir) => {
    directoriesConfig = dir;
  });

  /**
   * @type { import('@11ty/eleventy/src/TemplateConfig') }
   */
  let templateConfig;
  eleventyConfig.on('eleventy.config', (newTemplateConfig) => {
    templateConfig = newTemplateConfig;
  });

  eleventyConfig.on('eleventy.before', () => {
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
      if (this.page.url === false) {
        return null;
      }

      const { satoriOptions, sharpOptions, ...options } = mergeOptions({ directoriesConfig, pluginOptions });

      if (!fs.existsSync(TemplatePath.normalizeOperatingSystemFilePath(inputPath))) {
        throw new Error(`Could not find file for the \`ogImage\` shortcode, looking for: ${inputPath}`);
      }

      const { svg, pngBuffer } = await renderOgImage({ inputPath, data, satoriOptions, templateConfig });

      const image = await sharp(pngBuffer).toFormat(options.outputFileExtension, sharpOptions);

      const { outputFilePath, outputUrl } = getOutputParameters({
        options,
        fileSlug: options.getOutputFileSlug({ inputPath, data, svg, context: this }),
      });

      if (!fs.existsSync(options.outputDir)) {
        fs.mkdirSync(options.outputDir, { recursive: true });
      }

      await image.toFile(outputFilePath);

      eleventyConfig.logger.log(`Writing ${outputFilePath} from ${inputPath}`);

      return options.generateHTML(outputUrl);
    },
  );
};

// eslint-disable-next-line import/no-default-export
export default config;
