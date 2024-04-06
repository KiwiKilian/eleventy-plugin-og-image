import test from 'ava';
import sharp from 'sharp';
import { OgImage } from '../src/OgImage.js';
import { testConstructor } from './utils/testConstructor.js';

test('html returns html string', async (t) => {
  const ogImage = new OgImage(testConstructor);

  const html = await ogImage.html();

  t.snapshot(html);

  t.is(typeof html, 'string');
  t.regex(html, /<div class="root"><\/div>\n$/);
});

test('svg returns svg string', async (t) => {
  const ogImage = new OgImage(testConstructor);

  const svg = await ogImage.svg();

  t.snapshot(svg);

  t.is(typeof svg, 'string');
  t.regex(svg, /^<svg/);
});

test('pngBuffer returns Buffer', async (t) => {
  const ogImage = new OgImage(testConstructor);

  const pngBuffer = await ogImage.pngBuffer();

  t.true(pngBuffer instanceof Buffer);
});

test('render returns sharp object', async (t) => {
  const ogImage = new OgImage(testConstructor);

  const sharpRender = await ogImage.render();

  t.true(sharpRender instanceof sharp);
});

test('respects dimensions', async (t) => {
  const ogImage = new OgImage({
    ...testConstructor,
    options: {
      ...testConstructor.options,
      satoriOptions: { width: 120, height: 63 },
    },
  });

  const { width, height } = await (await ogImage.render()).metadata();

  t.is(width, 120);
  t.is(height, 63);
});

test('returns cached result', async (t) => {
  const ogImage = new OgImage(testConstructor);

  const firstPngBuffer = await ogImage.pngBuffer();
  const secondPngBuffer = await ogImage.pngBuffer();

  t.is(firstPngBuffer, secondPngBuffer);
});

const PAGE_URL = 'example/url';
const HASH = '759d60a8';

test('hash returns hash', async (t) => {
  const ogImage = new OgImage(testConstructor);

  const hash = await ogImage.hash();

  t.is(hash, HASH);
});

test('outputFileSlug returns hash', async (t) => {
  const ogImage = new OgImage({ ...testConstructor, data: { page: { url: PAGE_URL } } });

  t.is(await ogImage.outputFileSlug(), HASH);
});

test('outputFileName returns file name', async (t) => {
  const ogImage = new OgImage(testConstructor);

  t.is(await ogImage.outputFileName(), `${HASH}.png`);
});

test('outputFilePath returns file path', async (t) => {
  const ogImage = new OgImage(testConstructor);

  t.is(await ogImage.outputFilePath(), `./_site/og-images/${HASH}.png`);
});

test('previewFilePath returns path', (t) => {
  const ogImage = new OgImage({ ...testConstructor, data: { page: { url: PAGE_URL } } });

  t.is(ogImage.previewFilePath(), `./_site/og-images/preview/${PAGE_URL}.png`);
});
