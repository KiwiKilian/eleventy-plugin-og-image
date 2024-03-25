import fs from 'node:fs';
import module from 'node:module';
import { File } from '@11ty/eleventy/src/Plugins/RenderPlugin.js';
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
import slugify from '@sindresorhus/slugify';
import { Util } from './Util.js';

const require = module.createRequire(import.meta.url);

const Yoga = await initYoga(fs.readFileSync(require.resolve('yoga-wasm-web/dist/yoga.wasm')));
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
      this.results.html = await (await File(this.inputPath, { templateConfig: this.templateConfig }))(this.data);
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
  async bitmapBuffer() {
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
    return sharp(await this.bitmapBuffer()).toFormat(this.options.outputFileExtension, this.options.sharpOptions);
  }

  /** @returns {Promise<string>} */
  async hash() {
    const hash = crypto.createHash('sha256');

    hash.update(await this.html());
    hash.update(JSON.stringify(Util.sortObject(this.options.satoriOptions || {})));
    hash.update(JSON.stringify(Util.sortObject(this.options.sharpOptions || {})));

    return hash.digest('hex').substring(0, this.options.hashLength);
  }

  /** @returns {Promise<string>} */
  async outputFileSlug() {
    return this.options.getOutputFileSlug.bind(this)();
  }

  /** @returns {Promise<string>} */
  async generateHtml() {
    return this.options.generateHTML.bind(this)();
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

  /** @returns {string} */
  previewFileSlug() {
    return slugify(this.data.page.url) || 'index';
  }

  /** @returns {string} */
  previewFilePath() {
    return TemplatePath.standardizeFilePath(
      path.join(this.options.outputDir, 'preview', `${this.previewFileSlug()}.${this.options.outputFileExtension}`),
    );
  }
}
