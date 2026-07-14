import test from 'ava';
import { OgImage } from '../src/OgImage.js';
import { mergeOptions, pageUrlSlug } from '../src/utils/index.js';
import { directoriesConfig } from './utils/directoriesConfig.js';

test('pageUrlSlug converts page urls to file slugs', (t) => {
  t.is(pageUrlSlug({ page: { url: '/blog/my-post/' } }), 'blog-my-post');
  t.is(pageUrlSlug({ page: { url: '/' } }), 'index');
});

test('slugStrategy pageUrl resolves output path without rendering html', async (t) => {
  const options = mergeOptions({
    directoriesConfig,
    pluginOptions: {
      slugStrategy: 'pageUrl',
    },
  });

  const ogImage = new OgImage({
    inputPath: './test/og-test.og.njk',
    data: { page: { url: '/example/url/' } },
    options,
    templateConfig: undefined,
  });

  t.is(await ogImage.outputFileSlug(), 'example-url');
  t.is(await ogImage.outputFilePath(), './_site/og-images/example-url.png');
});
