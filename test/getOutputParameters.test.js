const test = require('ava');
const { getOutputParameters } = require('../src/getOutputParameters');
const { mergeOptions } = require('../src/mergeOptions');

const eleventyConfig = { dir: { input: '.', includes: '_includes', data: '_data', output: '_site' } };

test('returns proper defaults', (t) => {
  const { outputFilename, outputFilePath, outputUrl } = getOutputParameters('<svg />', mergeOptions(eleventyConfig));

  const hash = '9o5yTSfY93';

  t.is(outputFilename, `${hash}.png`);
  t.is(outputFilePath, `_site/og-images/${hash}.png`);
  t.is(outputUrl, `/og-images/${hash}.png`);
});
