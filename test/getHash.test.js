import test from 'ava';
import { getHash } from '../src/getHash.js';

test('returns correct hash', (t) => {
  const hash = getHash({ input: '<svg />', hashLength: 10 });

  t.is(hash, '9o5yTSfY93');
});
