import { RenderPlugin } from '@11ty/eleventy';
import { promises as fs } from 'node:fs';
/* eslint-disable import/no-unresolved */
// https://github.com/import-js/eslint-plugin-import/issues/2132
import { html as htmlToSatori } from 'satori-html';
/* eslint-enable import/no-unresolved */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import crypto from 'node:crypto';
import { TemplatePath } from '@11ty/eleventy-utils';
import path from 'node:path';
import url from 'node:url';
import { buildCacheKey } from './buildCache.js';

/** @implements {import('eleventy-plugin-og-image').OgImage} */
export class OgImage {
  /** @type {string} */
  inputPath;

  /** @type {Record<string, any>} */
  data;

  /** @type {import('eleventy-plugin-og-image').EleventyPluginOgImageMergedOptions} */
  options;

  /** @type {import('@11ty/eleventy/src/TemplateConfig').default} */
  templateConfig;

  /** @type {import('@11ty/eleventy/src/EleventyExtensionMap').default | undefined} */
  extensionMap;

  /**
   * @private
   * @type {{ html?: string; svg?: string; pngBuffer?: Buffer }}
   */
  results = {
    html: undefined,
    svg: undefined,
    pngBuffer: undefined,
  };

  /** @type {import('./buildCache.js').BuildCache | undefined} */
  buildCache;

  /**
   * @private
   * @type {string | undefined}
   */
  #cacheKey;

  /**
   * @param {string} inputPath
   * @param {Record<string, any>} data
   * @param {import('eleventy-plugin-og-image').EleventyPluginOgImageMergedOptions} options
   * @param {import('@11ty/eleventy/src/TemplateConfig').default} templateConfig
   * @param {import('@11ty/eleventy/src/EleventyExtensionMap').default} [extensionMap]
   * @param {import('./buildCache.js').BuildCache} [buildCache]
   */
  constructor({ inputPath, data, options, templateConfig, extensionMap, buildCache }) {
    this.inputPath = inputPath;
    this.data = data;
    this.options = options;
    this.templateConfig = templateConfig;
    this.extensionMap = extensionMap;
    this.buildCache = buildCache;
  }

  /** @returns {string} */
  getCacheKey() {
    if (!this.#cacheKey) {
      this.#cacheKey = buildCacheKey(
        this.inputPath,
        this.data,
        this.options.optionsHash ?? '',
      );
    }

    return this.#cacheKey;
  }

  /** @private */
  hydrateFromBuildCache() {
    const cached = this.buildCache?.get(this.getCacheKey());

    if (!cached) {
      return;
    }

    if (cached.html) {
      this.results.html = cached.html;
    }

    if (cached.svg) {
      this.results.svg = cached.svg;
    }

    if (cached.pngBuffer) {
      this.results.pngBuffer = cached.pngBuffer;
    }
  }

  /** @private */
  updateBuildCache() {
    this.buildCache?.set(this.getCacheKey(), this.results);
  }

  /** @returns {Promise<string>} */
  async html() {
    this.hydrateFromBuildCache();

    if (!this.results.html) {
      this.results.html = await (
        await RenderPlugin.File(this.inputPath, {
          templateConfig: this.templateConfig,
          extensionMap: this.extensionMap,
        })
      )(this.data);

      this.updateBuildCache();
    }

    return this.results.html;
  }

  /** @returns {Promise<string>} */
  async svg() {
    this.hydrateFromBuildCache();

    if (!this.results.svg) {
      this.results.svg = await satori(htmlToSatori(await this.html()), this.options.satoriOptions);
      this.updateBuildCache();
    }

    return this.results.svg;
  }

  /** @returns {Promise<Buffer>} */
  async pngBuffer() {
    this.hydrateFromBuildCache();

    if (!this.results.pngBuffer) {
      this.results.pngBuffer = await new Resvg(await this.svg(), { font: { loadSystemFonts: false } }).render().asPng();
      this.updateBuildCache();
    }

    return this.results.pngBuffer;
  }

  /**
   * Returns the configured output format
   *
   * @returns {Promise<import('sharp').Sharp>}
   */
  async render() {
    return sharp(await this.pngBuffer()).toFormat(this.options.outputFileExtension, this.options.sharpOptions);
  }

  /** @returns {boolean} */
  canPassthroughPng() {
    return this.options.outputFileExtension === 'png' && !this.options.sharpOptions;
  }

  /**
   * Writes the rendered image to disk, skipping Sharp when PNG passthrough is possible.
   *
   * @param {string} outputFilePath
   */
  async writeToFile(outputFilePath) {
    if (this.canPassthroughPng()) {
      await fs.writeFile(outputFilePath, await this.pngBuffer());

      return;
    }

    await (await this.render()).toFile(outputFilePath);
  }

  /** @returns {Promise<string>} */
  async hash() {
    const hash = crypto.createHash('sha256');

    hash.update(await this.html());

    if (this.options.optionsHash !== undefined) {
      hash.update(this.options.optionsHash);
    } else {
      const { computeOptionsHash } = await import('./utils/computeOptionsHash.js');

      hash.update(computeOptionsHash(this.options.satoriOptions, this.options.sharpOptions));
    }

    return hash.digest('hex').substring(0, this.options.hashLength);
  }

  /** @returns {Promise<string>} */
  async outputFileSlug() {
    return this.options.outputFileSlug(this);
  }

  /** @returns {Promise<string>} */
  async outputFileName() {
    return `${await this.outputFileSlug()}.${this.options.outputFileExtension}`;
  }

  /** @returns {Promise<string>} */
  async outputFilePath() {
    return TemplatePath.standardizeFilePath(path.join(this.options.outputDir, await this.outputFileName()));
  }

  /** @returns {Promise<string>} */
  async outputUrl() {
    const fileUrl = new url.URL('file://');
    fileUrl.pathname = path.join(this.options.urlPath, await this.outputFileName());

    return fileUrl.pathname;
  }

  /** @returns {Promise<string>} */
  async cacheFilePath() {
    return this.outputFilePath();
  }

  /** @returns {Promise<string>} */
  async shortcodeOutput() {
    return this.options.shortcodeOutput(this);
  }

  /** @returns {string} */
  previewFilePath() {
    return TemplatePath.standardizeFilePath(
      path.join(
        this.options.previewDir,
        `${this.data.page.url.replace(/\/$/, '') || 'index'}.${this.options.outputFileExtension}`,
      ),
    );
  }

  /** @returns {Promise<string>} */
  async previewHtml() {
    return `<html>
<head>
  <title>OG Image: ${this.data.page.url}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      position: relative;
    }

    #eleventy-plugin-og-image-html {
      width: ${this.options.satoriOptions.width}px;
      height: ${this.options.satoriOptions.height}px;
      overflow: hidden;
    }
  </style>
</head>
<body>
<div id="eleventy-plugin-og-image-html">${await this.html()}</div>
${await this.svg()}
<img
  alt="OG Image: ${this.data.page.url}"
  width="${this.options.satoriOptions.width}"
  height="${this.options.satoriOptions.height}"
  src="${await this.outputUrl()}"/>
</body>
</html>
`;
  }
}
