import { Util } from '../../src/Util.js';
import { directoriesConfig } from './directoriesConfig.js';

export const testConstructor = {
  inputPath: './test/og-test.og.njk',
  data: undefined,
  options: Util.mergeOptions({
    directoriesConfig,
  }),
  templateConfig: undefined,
};
