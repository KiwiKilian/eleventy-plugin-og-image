const test = require('ava');
const { getHash } = require('../src/getHash');

test('returns correct hash', (t) => {
  const hash = getHash({ input: '<svg />', hashLength: 10 });

  t.is(hash, '9o5yTSfY93');
});
