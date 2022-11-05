const { File } = require('@11ty/eleventy/src/Plugins/RenderPlugin');
const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');
// eslint-disable-next-line node/no-unpublished-require
const { html: htmlToSatori } = require('../build/satori-html');

module.exports = {
  /**
   * @param { string } inputPath
   * @param { Record<string, any> } [data]
   * @param { import('satori').SatoriOptions } satoriOptions
   * */
  async renderOgImage(inputPath, data, satoriOptions) {
    const html = await (await File(inputPath))(data);
    const svg = await satori(htmlToSatori(html), satoriOptions);
    const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });
    const pngBuffer = resvg.render().asPng();

    return { html, svg, pngBuffer };
  },
};
