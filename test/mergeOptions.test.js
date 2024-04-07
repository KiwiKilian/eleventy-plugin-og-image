import test from 'ava';
import { mergeOptions } from '../src/utils/index.js';
import { directoriesConfig } from './utils/directoriesConfig.js';

test('works without pluginOptions', (t) => {
  const { satoriOptions, sharpOptions, ...options } = mergeOptions({ directoriesConfig });

  t.truthy(options);
  t.truthy(satoriOptions);
});

test('creates default options', (t) => {
  const { satoriOptions, sharpOptions, ...options } = mergeOptions({ directoriesConfig });

  t.is(options.outputFileExtension, 'png');
  t.is(options.inputFileGlob, '**/*.og.*');

  t.is(satoriOptions.width, 1200);
  t.is(satoriOptions.height, 630);

  t.falsy(sharpOptions);
});

test('changes previewDir and urlPath if only outputDir is set', (t) => {
  const CUSTOM_OUTPUT_DIR = 'custom-output';

  const { outputDir, previewDir, urlPath } = mergeOptions({
    directoriesConfig,
    pluginOptions: { outputDir: CUSTOM_OUTPUT_DIR },
  });

  t.is(outputDir, `_site/${CUSTOM_OUTPUT_DIR}`);
  t.is(previewDir, `_site/${CUSTOM_OUTPUT_DIR}/preview`);
  t.is(urlPath, CUSTOM_OUTPUT_DIR);
});
