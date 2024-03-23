import test from 'ava';
import { getHash } from '../src/getHash.js';

test('returns correct hash', (t) => {
  const hash = getHash({ input: '<svg />', hashLength: 8 });

  t.is(hash, 'f68e724d');
});
