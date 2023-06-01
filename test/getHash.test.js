const test = require('ava');
const { mergeOptions } = require('../src/mergeOptions');
const { getHash } = require('../src/getHash');

const HASH = '9o5yTSfY93';

test('returns correct hash', (t) => {
  const hash = getHash({ input: '<svg />', hashLength: mergeOptions().hashLength });

  t.is(hash, HASH);
});
