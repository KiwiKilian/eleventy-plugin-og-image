import { directoriesConfig } from './directoriesConfig.js';
import { mergeOptions } from '../../src/utils/index.js';

export const testConstructor = {
  inputPath: './test/og-test.og.njk',
  data: undefined,
  options: mergeOptions({
    directoriesConfig,
  }),
  templateConfig: undefined,
};
