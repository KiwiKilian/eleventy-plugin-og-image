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

const require = module.createRequire(import.meta.url);

const Yoga = await initYoga(fs.readFileSync(require.resolve('yoga-wasm-web/dist/yoga.wasm')));
init(Yoga);

/**
 * @param { string } inputPath
 * @param { Record<string, any> } [data]
 * @param { import('satori').SatoriOptions } satoriOptions
 * @param { import('@11ty/eleventy/src/TemplateConfig').default } [templateConfig]
 *
 * @returns { Promise<{ html: string, svg: string, pngBuffer: Buffer }> }
 * */
export async function renderOgImage({ inputPath, data, satoriOptions, templateConfig }) {
  const html = await (await File(inputPath, { templateConfig }))(data);
  const svg = await satori(htmlToSatori(html), satoriOptions);
  const pngBuffer = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();

  return { html, svg, pngBuffer };
}
