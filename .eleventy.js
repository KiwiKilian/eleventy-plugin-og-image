/* eslint-disable no-empty */
import { promises as fs } from 'node:fs';
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

  eleventyConfig.on('eleventy.before', async ({ runMode }) => {
    try {
      await fs.mkdir(mergedOptions.outputDir, { recursive: true });
    } catch {}

    previewMode = ['watch', 'serve'].includes(runMode);

    if (previewMode) {
      try {
        await fs.mkdir(mergedOptions.previewDir, { recursive: true });
      } catch {}
    } else {
      try {
        await fs.rm(mergedOptions.previewDir, { recursive: true, force: true });
      } catch {}
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

      try {
        await fs.access(joinedInputPath);
      } catch {
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
      const cacheFilePath = await ogImage.cacheFilePath();

      if (cacheFilePath !== outputFilePath) {
        try {
          await fs.copyFile(cacheFilePath, outputFilePath);
        } catch {}
      }

      try {
        await fs.access(outputFilePath);
      } catch {
        const image = await ogImage.render();

        await image.toFile(outputFilePath);

        eleventyConfig.logger.log(
          `Writing ${TemplatePath.stripLeadingDotSlash(outputFilePath)} from ${joinedInputPath}`,
        );
      }

      if (previewMode) {
        const previewFilePath = ogImage.previewFilePath();

        try {
          await fs.mkdir(path.dirname(previewFilePath), { recursive: true });
        } catch {}

        await fs.copyFile(outputFilePath, previewFilePath);
        await fs.writeFile(`${previewFilePath}.html`, await ogImage.previewHtml());
      }

      return ogImage.shortcodeOutput();
    },
  );
}
