import test from 'ava';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { OgImageManifest } from '../src/manifest.js';
import { OgImage } from '../src/OgImage.js';
import { buildCacheKey } from '../src/buildCache.js';
import { mergeOptions } from '../src/utils/index.js';
import { directoriesConfig } from './utils/directoriesConfig.js';

async function createTmpDir(t) {
  const dir = path.join(os.tmpdir(), `eleventy-plugin-og-image-manifest-${process.pid}-${Date.now()}`);
  await fs.mkdir(dir, { recursive: true });
  t.teardown(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  return dir;
}

test('manifest persists entries between load and save', async (t) => {
  const dir = await createTmpDir(t);
  const manifestPath = path.join(dir, '.og-image-manifest.json');
  const manifest = new OgImageManifest(manifestPath);

  manifest.set('/page/', { dataHash: 'abc', outputFileName: 'page.png' });
  await manifest.save();

  const reloaded = new OgImageManifest(manifestPath);
  await reloaded.load();

  t.deepEqual(reloaded.get('/page/'), { dataHash: 'abc', outputFileName: 'page.png' });
});

test('manifest entry allows resolving output filename without hashing html', async (t) => {
  const options = mergeOptions({
    directoriesConfig,
    pluginOptions: {
      slugStrategy: 'pageUrl',
    },
  });

  const data = { page: { url: '/cached-page/' } };
  const dataHash = buildCacheKey('./test/og-test.og.njk', data, options.optionsHash, 1000);

  const ogImage = new OgImage({
    inputPath: './test/og-test.og.njk',
    data,
    options,
    templateConfig: undefined,
    templateMtime: 1000,
  });

  ogImage.resolvedOutputFileName = 'cached-page.png';

  t.is(await ogImage.outputFileName(), 'cached-page.png');
  t.is(dataHash, buildCacheKey('./test/og-test.og.njk', data, options.optionsHash, 1000));
});
