const fs = require('fs');
const { File } = require('@11ty/eleventy/src/Plugins/RenderPlugin');
const { default: satori, init } = require('satori/wasm');
const { Resvg } = require('@resvg/resvg-js');
// eslint-disable-next-line node/no-unpublished-require
const { default: initYoga } = require('../build/yoga-wasm-web');
// eslint-disable-next-line node/no-unpublished-require
const { html: htmlToSatori } = require('../build/satori-html');

module.exports = {
  /**
   * @param { string } inputPath
   * @param { Record<string, any> } [data]
   * @param { import('satori').SatoriOptions } satoriOptions
   * @param { import('@11ty/eleventy/src/TemplateConfig') } [templateConfig]
   * */
  async renderOgImage(inputPath, data, satoriOptions, templateConfig) {
    const yoga = await initYoga(fs.readFileSync('../node_modules/yoga-wasm-web/dist/yoga.wasm'));
    init(yoga);

    const html = await (await File(inputPath, { templateConfig }))(data);
    const svg = await satori(htmlToSatori(html), satoriOptions);
    const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });
    const pngBuffer = resvg.render().asPng();

    return { html, svg, pngBuffer };
  },
};
