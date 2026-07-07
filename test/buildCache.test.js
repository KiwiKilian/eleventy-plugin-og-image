import test from 'ava';
import { RenderPlugin } from '@11ty/eleventy';
import { OgImage } from '../src/OgImage.js';
import { BuildCache, buildCacheKey } from '../src/buildCache.js';
import { testConstructor } from './utils/testConstructor.js';

test('build cache deduplicates html rendering across OgImage instances', async (t) => {
  const buildCache = new BuildCache();
  let renderCount = 0;

  const originalFile = RenderPlugin.File;
  RenderPlugin.File = async () => {
    renderCount++;

    return async () => '<div class="root"></div>\n';
  };

  t.teardown(() => {
    RenderPlugin.File = originalFile;
  });

  const sharedData = { page: { url: '/shared/' }, title: 'Shared' };

  const first = new OgImage({ ...testConstructor, data: sharedData, buildCache });
  const second = new OgImage({ ...testConstructor, data: sharedData, buildCache });

  const firstHtml = await first.html();
  const secondHtml = await second.html();

  t.is(renderCount, 1);
  t.is(firstHtml, secondHtml);
});

test('buildCacheKey includes template mtime when provided', (t) => {
  const data = { page: { url: '/shared/' } };

  t.not(
    buildCacheKey('./input.og.njk', data, 'options-hash'),
    buildCacheKey('./input.og.njk', data, 'options-hash', 123),
  );
});

test('buildCacheKey ignores functions and serializes buffers', (t) => {
  const key = buildCacheKey(
    './input.og.njk',
    {
      page: { url: '/' },
      ignored: () => {},
      bin: Buffer.from('x'),
      nested: [{ fn: () => {} }, () => {}],
    },
    'options-hash',
  );

  t.regex(key, /^[a-f0-9]{64}$/);
});

test('build cache is cleared between builds', (t) => {
  const buildCache = new BuildCache();

  buildCache.set('key', { html: '<div></div>' });
  buildCache.clear();

  t.is(buildCache.get('key'), undefined);
});
