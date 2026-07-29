/* eslint-disable no-empty */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { TemplatePath } from '@11ty/eleventy-utils';
import { mergeOptions } from './src/utils/index.js';
import { OgImage } from './src/OgImage.js';
import { BuildCache, buildCacheKey } from './src/buildCache.js';
import { OgImageManifest } from './src/manifest.js';
import { ConcurrencyLimiter } from './src/concurrencyLimiter.js';

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

  /** @type {import('@11ty/eleventy/src/EleventyExtensionMap').default} */
  let extensionMap;

  eleventyConfig.on('eleventy.config', (newTemplateConfig) => {
    templateConfig = newTemplateConfig;
  });

  eleventyConfig.on('eleventy.extensionmap', (map) => {
    extensionMap = map;
  });

  /** @type {boolean} */
  let previewEnabled;

  const buildCache = new BuildCache();
  /** @type {OgImageManifest | undefined} */
  let manifest;
  const renderLimiter = new ConcurrencyLimiter(pluginOptions?.maxConcurrency);

  eleventyConfig.on('eleventy.before', async ({ runMode }) => {
    buildCache.clear();

    try {
      await fs.mkdir(mergedOptions.outputDir, { recursive: true });
    } catch {}

    if (mergedOptions.manifest) {
      manifest = new OgImageManifest(path.join(mergedOptions.outputDir, '.og-image-manifest.json'));
      await manifest.load();
    } else {
      manifest = undefined;
    }

    previewEnabled =
      mergedOptions.previewMode === 'auto' ? ['watch', 'serve'].includes(runMode) : mergedOptions.previewMode;

    if (previewEnabled) {
      try {
        await fs.mkdir(mergedOptions.previewDir, { recursive: true });
      } catch {}
    } else {
      try {
        await fs.rm(mergedOptions.previewDir, { recursive: true, force: true });
      } catch {}
    }
  });

  eleventyConfig.on('eleventy.after', async () => {
    if (manifest) {
      await manifest.save();
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

      const templateStat = await fs.stat(joinedInputPath);
      const templateMtime = templateStat.mtimeMs;
      const ogImageData = {
        page: this.page,
        eleventy: this.eleventy,
        eleventyPluginOgImage: {
          inputPath: joinedInputPath,
          width: satoriOptions.width,
          height: satoriOptions.height,
          outputFileExtension: options.outputFileExtension,
        },
        ...data,
      };

      const ogImage = new (pluginOptions.OgImage || OgImage)({
        inputPath: joinedInputPath,
        data: ogImageData,
        options: mergedOptions,
        templateConfig,
        extensionMap,
        buildCache,
        templateMtime,
      });

      const dataHash = buildCacheKey(
        joinedInputPath,
        ogImageData,
        mergedOptions.optionsHash,
        templateMtime,
      );

      let outputFilePath;

      if (manifest) {
        const manifestEntry = manifest.get(this.page.url);

        if (manifestEntry?.dataHash === dataHash) {
          outputFilePath = TemplatePath.standardizeFilePath(
            path.join(mergedOptions.outputDir, manifestEntry.outputFileName),
          );
          ogImage.resolvedOutputFileName = manifestEntry.outputFileName;
        }
      }

      if (!outputFilePath) {
        outputFilePath = await ogImage.outputFilePath();
      }

      const cacheFilePath = await ogImage.cacheFilePath();

      if (cacheFilePath !== outputFilePath) {
        try {
          await fs.copyFile(cacheFilePath, outputFilePath);
        } catch {}
      }

      try {
        await fs.access(outputFilePath);
      } catch {
        await renderLimiter.run(async () => {
          if (ogImage.canPassthroughPng?.()) {
            await ogImage.writeToFile(outputFilePath);
          } else {
            await (await ogImage.render()).toFile(outputFilePath);
          }
        });

        eleventyConfig.logger.log(
          `Writing ${TemplatePath.stripLeadingDotSlash(outputFilePath)} from ${joinedInputPath}`,
        );
      }

      if (manifest) {
        manifest.set(this.page.url, {
          dataHash,
          outputFileName: ogImage.resolvedOutputFileName || path.basename(outputFilePath),
        });
      }

      if (previewEnabled) {
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
