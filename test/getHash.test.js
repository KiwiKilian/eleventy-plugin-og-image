const test = require('ava');
const { getHash } = require('../src/getHash');

test('returns correct hash', (t) => {
  const hash = getHash({ input: '<svg />', hashLength: 8 });

  t.is(hash, 'f68e724d');
});
