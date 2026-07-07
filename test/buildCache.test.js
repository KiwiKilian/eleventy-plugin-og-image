import test from 'ava';
import { RenderPlugin } from '@11ty/eleventy';
import { OgImage } from '../src/OgImage.js';
import { BuildCache } from '../src/buildCache.js';
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

test('build cache is cleared between builds', (t) => {
  const buildCache = new BuildCache();

  buildCache.set('key', { html: '<div></div>' });
  buildCache.clear();

  t.is(buildCache.get('key'), undefined);
});
