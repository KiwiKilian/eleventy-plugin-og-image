const test = require('ava');
const { getOutputParameters } = require('../src/getOutputParameters');
const { mergeOptions } = require('../src/mergeOptions');
const { directoriesConfig } = require('./utils/directoriesConfig');

const FILE_SLUG = 'file-slug';

test('returns proper defaults', (t) => {
  const { outputFilename, outputFilePath, outputUrl } = getOutputParameters({
    options: mergeOptions({ directoriesConfig }),
    fileSlug: FILE_SLUG,
  });

  t.is(outputFilename, `${FILE_SLUG}.png`);
  t.is(outputFilePath, `_site/og-images/${FILE_SLUG}.png`);
  t.is(outputUrl, `/og-images/${FILE_SLUG}.png`);
});
