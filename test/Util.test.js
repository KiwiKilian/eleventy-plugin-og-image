import test from 'ava';
import { Util } from '../src/Util.js';
import { directoriesConfig } from './utils/directoriesConfig.js';

test('mergeOptions works without pluginOptions', (t) => {
  const { satoriOptions, sharpOptions, ...options } = Util.mergeOptions({ directoriesConfig });

  t.truthy(options);
  t.truthy(satoriOptions);
});

test('mergeOptions creates default options', (t) => {
  const { satoriOptions, sharpOptions, ...options } = Util.mergeOptions({ directoriesConfig });

  t.is(options.outputFileExtension, 'png');
  t.is(options.inputFileGlob, '**/*.og.*');

  t.is(satoriOptions.width, 1200);
  t.is(satoriOptions.height, 630);

  t.falsy(sharpOptions);
});

test('sortObject works', (t) => {
  t.is(
    JSON.stringify({
      a: 'a',
      b: {
        a: 'a',
        b: 'b',
      },
    }),
    JSON.stringify(
      Util.sortObject({
        b: {
          b: 'b',
          a: 'a',
        },
        a: 'a',
      }),
    ),
  );
});
