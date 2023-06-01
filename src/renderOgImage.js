const fs = require('fs');
const { File } = require('@11ty/eleventy/src/Plugins/RenderPlugin');
const { default: satori, init } = require('satori/wasm');
const { Resvg } = require('@resvg/resvg-js');

/* eslint-disable node/no-unpublished-require */
const { default: initYoga } = require('../build/yoga-wasm-web');
const { html: htmlToSatori } = require('../build/satori-html');
/* eslint-enable node/no-unpublished-require */

const Yoga = initYoga(fs.readFileSync(require.resolve('yoga-wasm-web/dist/yoga.wasm')));
init(Yoga);

module.exports = {
  /**
   * @param { string } inputPath
   * @param { Record<string, any> } [data]
   * @param { import('satori').SatoriOptions } satoriOptions
   * @param { import('@11ty/eleventy/src/TemplateConfig') } [templateConfig]
   *
   * @returns { Promise<{ html: string, svg: string, pngBuffer: Buffer }> }
   * */
  async renderOgImage({ inputPath, data, satoriOptions, templateConfig }) {
    const html = await (await File(inputPath, { templateConfig }))(data);
    const svg = await satori(htmlToSatori(html), satoriOptions);
    const pngBuffer = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();

    return { html, svg, pngBuffer };
  },
};
