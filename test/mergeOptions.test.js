const test = require('ava');
const { mergeOptions } = require('../src/mergeOptions');

const eleventyConfig = { dir: { input: '.', includes: '_includes', data: '_data', output: '_site' } };

test('works without pluginOptions', (t) => {
  const { satoriOptions, sharpOptions, ...options } = mergeOptions(eleventyConfig);

  t.truthy(options);
  t.truthy(satoriOptions);
});

test('creates default options', (t) => {
  const { satoriOptions, sharpOptions, ...options } = mergeOptions(eleventyConfig);

  t.is(options.outputFileExtension, 'png');
  t.is(options.inputFileGlob, '*.og.*');

  t.is(satoriOptions.width, 1200);
  t.is(satoriOptions.height, 630);

  t.falsy(sharpOptions);
});
