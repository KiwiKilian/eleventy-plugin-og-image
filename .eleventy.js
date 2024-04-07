import fs from 'node:fs';
import path from 'node:path';
import { TemplatePath } from '@11ty/eleventy-utils';
import { mergeOptions } from './src/utils/index.js';
import { OgImage } from './src/OgImage.js';

/**
 * @param {import('@11ty/eleventy/src/UserConfig').default} eleventyConfig
 * @param {EleventyPluginOgImageOptions} pluginOptions
 */
export default async function (eleventyConfig, pluginOptions) {
  /** @type {DirectoriesConfig} */
  let directoriesConfig;

  /** @type {EleventyPluginOgImageMergedOptions} */
  let mergedOptions;

  // Until https://github.com/11ty/eleventy/issues/2729 is fixed
  eleventyConfig.on('eleventy.directories', (dir) => {
    directoriesConfig = dir;
    mergedOptions = mergeOptions({ directoriesConfig, pluginOptions });
  });

  /** @type {import('@11ty/eleventy/src/TemplateConfig').default} */
  let templateConfig;

  eleventyConfig.on('eleventy.config', (newTemplateConfig) => {
    templateConfig = newTemplateConfig;
  });

  /** @type {boolean} */
  let previewMode;

  eleventyConfig.on('eleventy.before', ({ runMode }) => {
    if (!fs.existsSync(mergedOptions.outputDir)) {
      fs.mkdirSync(mergedOptions.outputDir, { recursive: true });
    }

    previewMode = ['watch', 'serve'].includes(runMode);

    const previewDirExists = fs.existsSync(mergedOptions.previewDir);

    if (previewMode) {
      if (!previewDirExists) {
        fs.mkdirSync(mergedOptions.previewDir, { recursive: true });
      }
    } else if (previewDirExists) {
      fs.rmSync(mergedOptions.previewDir, { recursive: true, force: true });
    }
  });

  eleventyConfig.ignores.add(mergeOptions({ pluginOptions }).inputFileGlob);

  eleventyConfig.addAsyncShortcode(
    'ogImage',
    /**
     * @param {string} shortcodeInputPath
     * @param {Record<string, any>} [data]
     * @returns {Promise<string>}
     */
    async function ogImageShortcode(shortcodeInputPath, data) {
      if (this.page.url === false) {
        return null;
      }

      const { satoriOptions, sharpOptions, ...options } = mergedOptions;

      const joinedInputPath = TemplatePath.standardizeFilePath(path.join(directoriesConfig.input, shortcodeInputPath));

      if (!fs.existsSync(joinedInputPath)) {
        throw new Error(`Could not find file for the \`ogImage\` shortcode, looking for: ${joinedInputPath}`);
      }

      const ogImage = new (pluginOptions.OgImage || OgImage)({
        inputPath: joinedInputPath,
        data: {
          page: this.page,
          eleventy: this.eleventy,
          eleventyPluginOgImage: {
            inputPath: joinedInputPath,
            width: satoriOptions.width,
            height: satoriOptions.height,
            outputFileExtension: options.outputFileExtension,
          },
          ...data,
        },
        options: mergedOptions,
        templateConfig,
      });

      const outputFilePath = await ogImage.outputFilePath();

      if (!fs.existsSync(outputFilePath)) {
        const cacheFilePath = await ogImage.cacheFilePath();

        if (cacheFilePath !== outputFilePath && fs.existsSync(cacheFilePath)) {
          fs.copyFileSync(cacheFilePath, outputFilePath);
        } else {
          const image = await ogImage.render();

          await image.toFile(outputFilePath);

          eleventyConfig.logger.log(
            `Writing ${TemplatePath.stripLeadingDotSlash(outputFilePath)} from ${joinedInputPath}`,
          );
        }
      }

      if (previewMode) {
        const previewFilePath = ogImage.previewFilePath();
        const dir = path.dirname(previewFilePath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.copyFileSync(outputFilePath, previewFilePath);
      }

      return ogImage.generateHtml();
    },
  );
}
