import test from 'ava';
import { mergeOptions } from '../src/mergeOptions.js';
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
