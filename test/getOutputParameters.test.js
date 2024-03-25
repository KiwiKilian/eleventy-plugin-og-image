import test from 'ava';
import { getOutputParameters } from '../src/getOutputParameters.js';
import { mergeOptions } from '../src/mergeOptions.js';
import { directoriesConfig } from './utils/directoriesConfig.js';

const OUTPUT_FILE_SLUG = 'output-file-slug';
const PREVIEW_FILE_SLUG = 'preview-file-slug';

test('returns proper defaults', (t) => {
  const { outputFilePath, outputUrl, previewFilePath } = getOutputParameters({
    options: mergeOptions({ directoriesConfig }),
    outputFileSlug: OUTPUT_FILE_SLUG,
    previewFileSlug: PREVIEW_FILE_SLUG,
  });

  t.is(outputFilePath, `./_site/og-images/${OUTPUT_FILE_SLUG}.png`);
  t.is(outputUrl, `/og-images/${OUTPUT_FILE_SLUG}.png`);
  t.is(previewFilePath, `./_site/og-images/preview/${PREVIEW_FILE_SLUG}.png`);
});
