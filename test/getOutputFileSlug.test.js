const test = require('ava');
const { mergeOptions } = require('../src/mergeOptions');
const { directoriesConfig } = require('./utils/directoriesConfig');

const createContext = ({ url, runMode }) => ({
  page: { url },
  eleventy: { env: { runMode } },
});

const FILE_SLUG = 'example-url';

test('returns page slug on watch', (t) => {
  const { getOutputFileSlug } = mergeOptions({ directoriesConfig });

  t.is(
    getOutputFileSlug({
      inputPath: '',
      data: {},
      svg: '<svg />',
      context: createContext({ url: 'example/url', runMode: 'watch' }),
    }),
    FILE_SLUG,
  );
});

test('returns page slug on serve', (t) => {
  const { getOutputFileSlug } = mergeOptions({ directoriesConfig });

  t.is(
    getOutputFileSlug({
      inputPath: '',
      data: {},
      svg: '<svg />',
      context: createContext({ url: 'example/url', runMode: 'serve' }),
    }),
    FILE_SLUG,
  );
});

test('returns hash on build', (t) => {
  const { getOutputFileSlug } = mergeOptions({ directoriesConfig });

  t.is(
    getOutputFileSlug({
      inputPath: '',
      data: {},
      svg: '<svg />',
      context: createContext({ url: 'example/url', runMode: 'build' }),
    }),
    'f68e724d',
  );
});
