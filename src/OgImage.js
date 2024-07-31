import { promises as fs } from 'node:fs';
import module from 'node:module';
import { RenderPlugin } from '@11ty/eleventy';
/* eslint-disable import/no-unresolved */
// https://github.com/import-js/eslint-plugin-import/issues/2132
import { html as htmlToSatori } from 'satori-html';
import initYoga from 'yoga-wasm-web';
/* eslint-enable import/no-unresolved */
import satori, { init } from 'satori/wasm';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import crypto from 'node:crypto';
import { TemplatePath } from '@11ty/eleventy-utils';
import path from 'node:path';
import url from 'node:url';
import { sortObject } from './utils/index.js';

const require = module.createRequire(import.meta.url);

const Yoga = await initYoga(await fs.readFile(require.resolve('yoga-wasm-web/dist/yoga.wasm')));
init(Yoga);

export class OgImage {
  /** @type {string} */
  inputPath;

  /** @type {Record<string, any>} */
  data;

  /** @type {EleventyPluginOgImageMergedOptions} */
  options;

  /** @type {import('@11ty/eleventy/src/TemplateConfig').default} */
  templateConfig;

  /**
   * @private
   * @type {{ html?: string; svg?: string; pngBuffer?: Buffer }}
   */
  results = {
    html: undefined,
    svg: undefined,
    pngBuffer: undefined,
  };

  /**
   * @param {string} inputPath
   * @param {Record<string, any>} data
   * @param {EleventyPluginOgImageMergedOptions} options
   * @param {import('@11ty/eleventy/src/TemplateConfig').default} templateConfig
   */
  constructor({ inputPath, data, options, templateConfig }) {
    this.inputPath = inputPath;
    this.data = data;
    this.options = options;
    this.templateConfig = templateConfig;
  }

  /** @returns {Promise<string>} */
  async html() {
    if (!this.results.html) {
      this.results.html = await (await RenderPlugin.File(this.inputPath, { templateConfig: this.templateConfig }))(this.data);
    }

    return this.results.html;
  }

  /** @returns {Promise<string>} */
  async svg() {
    if (!this.results.svg) {
      this.results.svg = await satori(htmlToSatori(await this.html()), this.options.satoriOptions);
    }

    return this.results.svg;
  }

  /** @returns {Promise<Buffer>} */
  async pngBuffer() {
    if (!this.results.pngBuffer) {
      this.results.pngBuffer = await new Resvg(await this.svg(), { font: { loadSystemFonts: false } }).render().asPng();
    }

    return this.results.pngBuffer;
  }

  /**
   * Returns the configured output format
   *
   * @returns {Promise<Sharp>}
   */
  async render() {
    return sharp(await this.pngBuffer()).toFormat(this.options.outputFileExtension, this.options.sharpOptions);
  }

  /** @returns {Promise<string>} */
  async hash() {
    const hash = crypto.createHash('sha256');

    hash.update(await this.html());
    hash.update(JSON.stringify(sortObject(this.options.satoriOptions || {})));
    hash.update(JSON.stringify(sortObject(this.options.sharpOptions || {})));

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
  width="${this.options.satoriOptions.width}"
  height="${this.options.satoriOptions.height}"
  src="${await this.outputUrl()}"/>
</body>
</html>
`;
  }
}
